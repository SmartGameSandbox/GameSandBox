
// Hand Constants
export const HAND_WIDTH = 1400
export const HAND_HEIGHT = 250
export const CARD_DIVIDER_WIDTH_X = 30

// Canvas Constants
export const CANVAS_HEIGHT = 800;
export const CANVAS_WIDTH = 1300;

// Card Constants (h:w = 7:5)
export const CARD_HEIGHT = 91;
export const CARD_WIDTH = 65;
export const HAND_CARD_GAP = 30;
export const HAND_PADDING_X = 110;
export const HAND_PADDING_Y = 15;

// Deck Constants
export const DECK_PADDING = 10;
export const DECK_STARTING_POSITION_X = 600 - DECK_PADDING;
export const DECK_STARTING_POSITION_Y = 200 - DECK_PADDING;
export const DECK_AREA_WIDTH = CARD_WIDTH + 2 * DECK_PADDING;
export const DECK_AREA_HEIGHT = CARD_HEIGHT + 2 * DECK_PADDING;

// Color Constants
export const COLOR_PRIMARY = "#163B6E";
export const COLOR_PRIMARY_VARIANT = "#003B94";
export const COLOR_SECONDARY = "#FDF551";
export const COLOR_SECONDARY_VARIANT = "#E5DE3E";
export const COLOR_OFFWHITE = "#E8EBF0"

export const BASE_URL = 
    process.env.NODE_ENV === "production"
      ? "https://smartgamesandbox.herokuapp.com"
      : "http://localhost:8000";