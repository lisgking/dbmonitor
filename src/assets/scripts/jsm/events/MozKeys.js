define({
	"CANCEL":0x03,//Cancel key.
	"HELP":0x06,//Help key.
	"BACK_SPACE":0x08,//Backspace key.
	"TAB":0x09,//Tab key.
	"CLEAR":0x0C,//"5" key on Numpad when NumLock is unlocked. Or on Mac, clear key which is positioned at NumLock key.
	"RETURN":0x0D,//Return/enter key on the main keyboard.
	"ENTER":0x0E,//Reserved, but not used.  Obsolete since Gecko 30 (Dropped, see bug 969247.)
	"SHIFT":0x10,//Shift key.
	"CONTROL":0x11,//Control key.
	"ALT":0x12,//Alt (Option on Mac) key.
	"PAUSE":0x13,//Pause key.
	"CAPS_LOCK":0x14,//Caps lock.
	"KANA":0x15,//Linux support for this keycode was added in Gecko 4.0.
	"HANGUL":0x15,//Linux support for this keycode was added in Gecko 4.0.
	"EISU":0x16,//"英数" key on Japanese Mac keyboard.
	"JUNJA":0x17,//Linux support for this keycode was added in Gecko 4.0.
	"FINAL":0x18,//Linux support for this keycode was added in Gecko 4.0.
	"HANJA":0x19,//Linux support for this keycode was added in Gecko 4.0.
	"KANJI":0x19,//Linux support for this keycode was added in Gecko 4.0.
	"ESCAPE":0x1B,//Escape key.
	"CONVERT":0x1C,//Linux support for this keycode was added in Gecko 4.0.
	"NONCONVERT":0x1D,//Linux support for this keycode was added in Gecko 4.0.
	"ACCEPT":0x1E,//Linux support for this keycode was added in Gecko 4.0.
	"MODECHANGE":0x1F,//Linux support for this keycode was added in Gecko 4.0.
	"SPACE":0x20,//Space bar.
	"PAGE_UP":0x21,//Page Up key.
	"PAGE_DOWN":0x22,//Page Down key.
	"END":0x23,//End key.
	"HOME":0x24,//Home key.
	"LEFT":0x25,//Left arrow.
	"UP":0x26,//Up arrow.
	"RIGHT":0x27,//Right arrow.
	"DOWN":0x28,//Down arrow.
	"SELECT":0x29,//Linux support for this keycode was added in Gecko 4.0.
	"PRINT":0x2A,//Linux support for this keycode was added in Gecko 4.0.
	"EXECUTE":0x2B,//Linux support for this keycode was added in Gecko 4.0.
	"PRINTSCREEN":0x2C,//Print Screen key.
	"INSERT":0x2D,//Ins(ert) key.
	"DELETE":0x2E,//Del(ete) key.
	"0":0x30,//"0" key in standard key location.
	"1":0x31,//"1" key in standard key location.
	"2":0x32,//"2" key in standard key location.
	"3":0x33,//"3" key in standard key location.
	"4":0x34,//"4" key in standard key location.
	"5":0x35,//"5" key in standard key location.
	"6":0x36,//"6" key in standard key location.
	"7":0x37,//"7" key in standard key location.
	"8":0x38,//"8" key in standard key location.
	"9":0x39,//"9" key in standard key location.
	"COLON":0x3A,//Colon (":") key.
	"SEMICOLON":0x3B,//Semicolon (";") key.
	"LESS_THAN":0x3C,//Less-than ("<") key.
	"EQUALS":0x3D,//Equals ("=") key.
	"GREATER_THAN":0x3E,//Greater-than (">") key.
	"QUESTION_MARK":0x3F,//Question mark ("?") key.
	"AT":0x40,//Atmark ("@") key.
	"A":0x41,//"A" key.
	"B":0x42,//"B" key.
	"C":0x43,//"C" key.
	"D":0x44,//"D" key.
	"E":0x45,//"E" key.
	"F":0x46,//"F" key.
	"G":0x47,//"G" key.
	"H":0x48,//"H" key.
	"I":0x49,//"I" key.
	"J":0x4A,//"J" key.
	"K":0x4B,//"K" key.
	"L":0x4C,//"L" key.
	"M":0x4D,//"M" key.
	"N":0x4E,//"N" key.
	"O":0x4F,//"O" key.
	"P":0x50,//"P" key.
	"Q":0x51,//"Q" key.
	"R":0x52,//"R" key.
	"S":0x53,//"S" key.
	"T":0x54,//"T" key.
	"U":0x55,//"U" key.
	"V":0x56,//"V" key.
	"W":0x57,//"W" key.
	"X":0x58,//"X" key.
	"Y":0x59,//"Y" key.
	"Z":0x5A,//"Z" key.
	"WIN":0x5B,//Windows logo key on Windows. Or Super or Hyper key on Linux.
	"CONTEXT_MENU":0x5D,//Opening context menu key.
	"SLEEP":0x5F,//Linux support for this keycode was added in Gecko 4.0.
	"NUMPAD0":0x60,//"0" on the numeric keypad.
	"NUMPAD1":0x61,//"1" on the numeric keypad.
	"NUMPAD2":0x62,//"2" on the numeric keypad.
	"NUMPAD3":0x63,//"3" on the numeric keypad.
	"NUMPAD4":0x64,//"4" on the numeric keypad.
	"NUMPAD5":0x65,//"5" on the numeric keypad.
	"NUMPAD6":0x66,//"6" on the numeric keypad.
	"NUMPAD7":0x67,//"7" on the numeric keypad.
	"NUMPAD8":0x68,//"8" on the numeric keypad.
	"NUMPAD9":0x69,//"9" on the numeric keypad.
	"MULTIPLY":0x6A,//"*" on the numeric keypad.
	"ADD":0x6B,//"+" on the numeric keypad.
	"SEPARATOR":0x6C,//
	"SUBTRACT":0x6D,//"-" on the numeric keypad.
	"DECIMAL":0x6E,//Decimal point on the numeric keypad.
	"DIVIDE":0x6F,//"/" on the numeric keypad.
	"F1":0x70,//F1 key.
	"F2":0x71,//F2 key.
	"F3":0x72,//F3 key.
	"F4":0x73,//F4 key.
	"F5":0x74,//F5 key.
	"F6":0x75,//F6 key.
	"F7":0x76,//F7 key.
	"F8":0x77,//F8 key.
	"F9":0x78,//F9 key.
	"F10":0x79,//F10 key.
	"F11":0x7A,//F11 key.
	"F12":0x7B,//F12 key.
	"F13":0x7C,//F13 key.
	"F14":0x7D,//F14 key.
	"F15":0x7E,//F15 key.
	"F16":0x7F,//F16 key.
	"F17":0x80,//F17 key.
	"F18":0x81,//F18 key.
	"F19":0x82,//F19 key.
	"F20":0x83,//F20 key.
	"F21":0x84,//F21 key.
	"F22":0x85,//F22 key.
	"F23":0x86,//F23 key.
	"F24":0x87,//F24 key.
	"NUM_LOCK":0x90,//Num Lock key.
	"SCROLL_LOCK":0x91,//Scroll Lock key.
	"WIN_OEM_FJ_JISHO":0x92,//An OEM specific key on Windows. This was used for "Dictionary" key on Fujitsu OASYS.
	"WIN_OEM_FJ_MASSHOU":0x93,//An OEM specific key on Windows. This was used for "Unregister word" key on Fujitsu OASYS.
	"WIN_OEM_FJ_TOUROKU":0x94,//An OEM specific key on Windows. This was used for "Register word" key on Fujitsu OASYS.
	"WIN_OEM_FJ_LOYA":0x95,//An OEM specific key on Windows. This was used for "Left OYAYUBI" key on Fujitsu OASYS.
	"WIN_OEM_FJ_ROYA":0x96,//An OEM specific key on Windows. This was used for "Right OYAYUBI" key on Fujitsu OASYS.
	"CIRCUMFLEX":0xA0,//Circumflex ("^") key.
	"EXCLAMATION":0xA1,//Exclamation ("!") key.
	"DOUBLE_QUOTE":0xA3,//Double quote (""") key.
	"HASH":0xA3,//Hash ("#") key.
	"DOLLAR":0xA4,//Dollar sign ("$") key.
	"PERCENT":0xA5,//Percent ("%") key.
	"AMPERSAND":0xA6,//Ampersand ("&") key.
	"UNDERSCORE":0xA7,//Underscore ("_") key.
	"OPEN_PAREN":0xA8,//Open parenthesis ("(") key.
	"CLOSE_PAREN":0xA9,//Close parenthesis (")") key.
	"ASTERISK":0xAA,//Asterisk ("*") key.
	"PLUS":0xAB,//Plus ("+") key.
	"PIPE":0xAC,//Pipe ("|") key.
	"HYPHEN_MINUS":0xAD,//Hyphen-US/docs/Minus ("-") key.
	"OPEN_CURLY_BRACKET":0xAE,//Open curly bracket ("{") key.
	"CLOSE_CURLY_BRACKET":0xAF,//Close curly bracket ("}") key.
	"TILDE":0xB0,//Tilde ("~") key.
	"VOLUME_MUTE":0xB5,//Audio mute key.
	"VOLUME_DOWN":0xB6,//Audio volume down key
	"VOLUME_UP":0xB7,//Audio volume up key
	"COMMA":0xBC,//Comma (",") key.
	"PERIOD":0xBE,//Period (".") key.
	"SLASH":0xBF,//Slash ("/") key.
	"BACK_QUOTE":0xC0,//Back tick ("`") key.
	"OPEN_BRACKET":0xDB,//Open square bracket ("[") key.
	"BACK_SLASH":0xDC,//Back slash ("\") key.
	"CLOSE_BRACKET":0xDD,//Close square bracket ("]") key.
	"QUOTE":0xDE,//Quote (''') key.
	"META":0xE0,//Meta key on Linux, Command key on Mac.
	"ALTGR":0xE1,//AltGr key (Level 3 Shift key or Level 5 Shift key) on Linux.
	"WIN_ICO_HELP":0xE3,//An OEM specific key on Windows. This is (was?) used for Olivetti ICO keyboard.
	"WIN_ICO_00":0xE4,//An OEM specific key on Windows. This is (was?) used for Olivetti ICO keyboard.
	"WIN_ICO_CLEAR":0xE6,//An OEM specific key on Windows. This is (was?) used for Olivetti ICO keyboard.
	"WIN_OEM_RESET":0xE9,//An OEM specific key on Windows. This was used for Nokia/Ericsson's device.
	"WIN_OEM_JUMP":0xEA,//An OEM specific key on Windows. This was used for Nokia/Ericsson's device.
	"WIN_OEM_PA1":0xEB,//An OEM specific key on Windows. This was used for Nokia/Ericsson's device.
	"WIN_OEM_PA2":0xEC,//An OEM specific key on Windows. This was used for Nokia/Ericsson's device.
	"WIN_OEM_PA3":0xED,//An OEM specific key on Windows. This was used for Nokia/Ericsson's device.
	"WIN_OEM_WSCTRL":0xEE,//An OEM specific key on Windows. This was used for Nokia/Ericsson's device.
	"WIN_OEM_CUSEL":0xEF,//An OEM specific key on Windows. This was used for Nokia/Ericsson's device.
	"WIN_OEM_ATTN":0xF0,//An OEM specific key on Windows. This was used for Nokia/Ericsson's device.
	"WIN_OEM_FINISH":0xF1,//An OEM specific key on Windows. This was used for Nokia/Ericsson's device.
	"WIN_OEM_COPY":0xF2,//An OEM specific key on Windows. This was used for Nokia/Ericsson's device.
	"WIN_OEM_AUTO":0xF3,//An OEM specific key on Windows. This was used for Nokia/Ericsson's device.
	"WIN_OEM_ENLW":0xF4,//An OEM specific key on Windows. This was used for Nokia/Ericsson's device.
	"WIN_OEM_BACKTAB":0xF,//An OEM specific key on Windows. This was used for Nokia/Ericsson's device.
	"ATTN":0xF6,//Attn (Attention) key of IBM midrange computers, e.g., AS/400.
	"CRSEL":0xF7,//CrSel (Cursor Selection) key of IBM 3270 keyboard layout.
	"EXSEL":0xF8,//ExSel (Extend Selection) key of IBM 3270 keyboard layout.
	"EREOF":0xF9,//Erase EOF key of IBM 3270 keyboard layout.
	"PLAY":0xFA,//Play key of IBM 3270 keyboard layout.
	"ZOOM":0xFB,//Zoom key.
	"PA1":0xFD,//PA1 key of IBM 3270 keyboard layout.
	"WIN_OEM_CLEAR":0xFE//Clear key, but we're not sure the meaning difference from DOM_VK_CLEAR.
});