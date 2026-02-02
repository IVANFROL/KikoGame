import pygame
# Import pygame.
# We need pygame here specifically for its sound system (mixer).


# =========================
# BACKGROUND MUSIC
# =========================
def music():
    # This function starts the background music of the game.
    # It is usually called once when the game starts.
    # If sound fails to load, the game continues without sound.

    try:
        # pygame.mixer.music is a special music player in pygame.
        # It is meant for long sounds like background music.
        pygame.mixer.music.load('PICS/Music/Hintergrund.mp3')
        # This loads the music file from disk into memory.
        # The file path must exist, otherwise the game will crash.

        pygame.mixer.music.play(-1)
        # play(-1) means:
        # - start playing the music
        # - loop it forever
        #
        # If we used play(1), it would play once.
        # If we used play(0), it would also play once.
        # -1 is special and means "repeat endlessly".
    except Exception as e:
        # If sound fails to load (e.g., in web environment), continue without sound
        print(f"Warning: Could not load background music: {e}")
        print("Game will continue without sound.")


# =========================
# SOUND WHEN CLICKING A DEPARTMENT
# =========================
def click_on_depart():
    # This function plays a short sound when the player clicks on a department.
    # It is a sound effect, NOT background music.
    # pygame.mixer.Sound is used for short sounds (effects).
    # These sounds can overlap and be played many times.
    try:
        click_on_depart = pygame.mixer.Sound("PICS/Music/Sound_82750500 1634320431.mp3")
        # Load the sound effect into memory.
        click_on_depart.play()
        # Play the sound once immediately.
    except Exception as e:
        # If sound fails, continue silently
        pass


# =========================
# SOUND WHEN COLLIDING WITH AN ASTEROID
# =========================
def hit_cometa():
    # This function plays a sound when the hero is hit by a comet (asteroid).
    # It gives audio feedback that something bad happened.
    try:
        hit_cometa = pygame.mixer.Sound("PICS/Music/Collision1.mp3")
        # Load the collision sound.

        hit_cometa.play()
        # Play the collision sound once.
    except Exception as e:
        # If sound fails, continue silently
        pass


# =========================
# SOUND WHEN HERO IS HEALED
# =========================
def heal_rocket():
    # This function plays a sound when the hero collects a health key.
    # It gives positive feedback to the player.
    try:
        heal_rocket = pygame.mixer.Sound("PICS/Music/Heilung.mp3")
        # Load the healing sound effect.
        heal_rocket.play()
        # Play the healing sound once.
    except Exception as e:
        # If sound fails, continue silently
        pass
