// Main game loop and state management
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.focus();
        
        // Game state
        this.state = "menu"; // "menu", "rules", "game"
        this.rules_completed = false;
        this.running = true;
        
        // Game objects
        this.background = new Background();
        this.rocket = new Spaceship(this.ctx);
        this.scores = new Scores(this.ctx);
        this.start_screen = new StartScreen(this.ctx);
        this.rules_screen = new RulesScreen(this.ctx);
        this.test_screen = new Quiz(this.ctx);
        this.soundManager = new SoundManager();
        this.eventsManager = new EventsManager();
        
        // Game entities
        this.asteroids = [];
        this.departments = [];
        this.keys = [];
        this.planets = [];
        this.active_house = null;
        
        // Input
        this.keys_pressed = {};
        this.mouse_x = 0;
        this.mouse_y = 0;
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start game loop
        this.lastTime = performance.now();
        this.gameLoop();
    }

    setupEventListeners() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            this.keys_pressed[e.key] = true;
            
            if (e.key === ' ' && this.state === 'game') {
                e.preventDefault();
                this.doPause();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys_pressed[e.key] = false;
        });
        
        // Mouse
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse_x = e.clientX - rect.left;
            this.mouse_y = e.clientY - rect.top;
            this.handleMouseClick(this.mouse_x, this.mouse_y);
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse_x = e.clientX - rect.left;
            this.mouse_y = e.clientY - rect.top;
        });
    }

    handleMouseClick(x, y) {
        if (this.state === "menu") {
            const action = this.start_screen.handle_click(x, y, this.rules_completed);
            if (action === "rules") {
                this.rules_screen.open();
                this.state = "rules";
            } else if (action === "start") {
                this.start_game_new_session();
                this.state = "game";
            }
        } else if (this.state === "rules") {
            const r = this.rules_screen.handle_click(x, y);
            if (r === "done") {
                this.rules_completed = true;
                this.state = "menu";
            }
        } else if (this.state === "game") {
            if (this.scores.game_over) {
                if (this.scores.restart_clicked(x, y)) {
                    this.restart_run_keep_departments();
                }
                return;
            }
            
            if (this.test_screen.quiz_active) {
                const result = this.test_screen.handle_click(x, y);
                if (result === "finished" && this.active_house) {
                    this.scores.add_department_score(this.test_screen.get_score());
                    this.scores.completed_departments.add(this.active_house.dept_id);
                    this.active_house.start_fly_out();
                    this.active_house = null;
                    this.eventsManager.resume_after_quiz(this.scores);
                    
                    if (this.scores.completed_departments.size >= this.eventsManager.Total_departments) {
                        this.scores.to_planet = true;
                        this.eventsManager.pause_timers();
                        this.eventsManager.schedule_planet_spawn();
                    }
                }
            } else {
                if (!this.scores.to_planet) {
                    const dept = this.clicked_department(x, y);
                    if (dept) {
                        const dept_data = Departments.find(d => d.id === dept.dept_id);
                        if (dept_data) {
                            this.active_house = dept;
                            this.eventsManager.pause_timers();
                            this.test_screen.open_quiz(dept_data);
                            this.soundManager.pauseMusic();
                        }
                    }
                }
            }
        }
    }

    clicked_department(x, y) {
        for (const dept of this.departments) {
            if (pointInRect(x, y, dept.rect)) {
                this.soundManager.playClick();
                return dept;
            }
        }
        return null;
    }

    reset_world() {
        this.asteroids = [];
        this.departments = [];
        this.keys = [];
        this.planets = [];
        this.rocket.health = 3;
        this.rocket.x = 600;
        this.rocket.y = 400;
        this.rocket.hitbox.x = 600;
        this.rocket.hitbox.y = 450;
        this.test_screen.close_quiz();
    }

    start_game_new_session() {
        this.reset_world();
        this.scores.game = true;
        this.scores.game_over = false;
        this.scores.to_planet = false;
        this.scores.reached_planet = false;
        this.scores.completed_departments.clear();
        this.scores.total_correct_answers = 0;
        this.active_house = null;
        this.eventsManager.init_events();
        this.soundManager.playMusic();
    }

    restart_run_keep_departments() {
        this.reset_world();
        this.scores.game = true;
        this.scores.game_over = false;
        this.scores.reached_planet = false;
        this.scores.to_planet = (this.scores.completed_departments.size >= this.eventsManager.Total_departments);
        this.active_house = null;
        this.eventsManager.init_events();
        
        if (this.scores.to_planet) {
            this.eventsManager.pause_timers();
            this.eventsManager.schedule_planet_spawn();
        }
        this.soundManager.playMusic();
    }

    spawnKey() {
        this.keys.push(new Key());
    }

    spawnDepartment() {
        // Check if department is still on screen
        for (const dept of this.departments) {
            if (!dept.fly_out) {
                return;
            }
        }
        
        // Find next uncompleted department
        for (const d of Departments) {
            if (!this.scores.completed_departments.has(d.id)) {
                this.departments.push(new Border(d.stop_x, d.image, d.id, d.title, d.y));
                
                // Schedule next department
                this.eventsManager.Department_fly_in = setTimeout(() => {
                    if (this.state === 'game' && !this.scores.to_planet) {
                        this.spawnDepartment();
                    }
                }, this.eventsManager.Departments_between_time_distance);
                return;
            }
        }
    }

    spawnPlanet() {
        if (this.planets.length === 0) {
            this.planets.push(new Planet());
        }
    }

    doPause() {
        // Simple pause - just wait for space again
        // In a full implementation, you'd show a pause overlay
    }

    gameLoop() {
        if (!this.running) return;
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
        
        // Update background
        this.background.update();
        this.background.render(this.ctx);
        
        // State-specific logic
        if (this.state === "menu") {
            this.start_screen.draw(this.rules_completed);
        } else if (this.state === "rules") {
            this.rules_screen.draw();
        } else if (this.state === "game") {
            // Update departments
            if (this.scores.game) {
                for (const dept of this.departments) {
                    dept.update();
                }
            }
            
            // Draw departments
            for (const dept of this.departments) {
                dept.draw(this.ctx);
            }
            
            // Remove off-screen departments
            this.departments = this.departments.filter(d => !d.isOffScreen());
            
            if (this.scores.game) {
                if (this.test_screen.quiz_active) {
                    // Quiz is active - freeze gameplay
                    this.scores.show_health(this.rocket);
                    this.scores.visited_departments();
                    this.test_screen.draw();
                } else {
                    // Normal gameplay
                    this.rocket.update(this.keys_pressed);
                    this.rocket.draw();
                    
                    EventsManager.make_comet(this.asteroids, this.ctx);
                    EventsManager.move_key(this.keys, this.ctx);
                    EventsManager.collide(this.rocket, this.asteroids, this.keys, this.soundManager);
                    
                    // Planet phase
                    for (const planet of this.planets) {
                        planet.update();
                        planet.draw(this.ctx);
                    }
                    
                    EventsManager.collide_with_planet(this.rocket, this.planets, this.scores);
                    
                    // UI
                    this.scores.show_health(this.rocket);
                    this.scores.visited_departments();
                    this.scores.finish(this.rocket);
                    this.test_screen.draw();
                }
            } else {
                // Game over or win
                for (const planet of this.planets) {
                    planet.update();
                    planet.draw(this.ctx);
                }
                
                this.scores.show_health(this.rocket);
                this.scores.visited_departments();
                this.scores.finish(this.rocket);
                this.scores.draw_restart_button();
            }
            
            // Music control
            if (this.test_screen.quiz_active) {
                this.soundManager.pauseMusic();
            } else {
                this.soundManager.resumeMusic();
            }
        }
        
        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start game when page loads
window.addEventListener('load', () => {
    window.game = new Game();
});

