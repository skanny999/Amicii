import { StyleSheet, Dimensions, Platform } from 'react-native'

//COLORS

export const PRIMARY = "#7444C0"
export const SECONDARY = "#5636B8"
export const WHITE = "#FFFFFF"
export const GRAY = "#757E90"
export const DARK_GRAY = "#363636"
export const BLACK = "#000000"

export const ONLINE = "#46A575"
export const OFFLINE = "#D04949"

export const DUNNO = "#F9F11A"
export const LIKE = "#228B22"
export const DISLIKE = "#FF0000"

//SIZES

export const WINDOW_WIDTH = Dimensions.get("window").width;
export const WINDOW_HEIGHT = Dimensions.get("window").height;

const isAndroid = Platform.OS === "android"

export default StyleSheet.create({

    // COMPONENTS

    // CARD ITEM
    cardItemContainer: {
        backgroundColor: WHITE,
        borderRadius: 8,
        alignItems: "center",
        margin: 10,
        elevation: 1,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowColor: BLACK,
        shadowOffset: { height: 0, width: 0 }
    }, 
    cardItemBio: {
        color: GRAY,
        textAlign: 'center',
        marginTop:0,
        paddingHorizontal: 20
    },

    //GRIDLIST
    emojiGrid: {
        marginBottom: 32,
        marginTop: 10,
        alignItems: 'center'
    },
    emojiItem: {
        margin: 5,
        width: 25,
        color: 'white',
        alignItems: 'center',
        fontSize:20
    },

    //BUTTONS
    buttonGeneral: {
        backgroundColor: WHITE,
        padding: 10,
        borderRadius: 20,
        width: 90,
        elevation: 1,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowColor: BLACK,
        shadowOffset: {height: 0, width: 0}
    },
    buttonText: {
        color: DARK_GRAY,
        fontSize: 13,
        textAlign: 'center'
    },
    cancelButtonText: {
        color: DARK_GRAY,
        fontSize: 13,
        textAlign: 'center'
    },

    //TAB BAR ICON
    tabBarIconMenu: {
        alignItems: "center"
    },
    tabBarIconText: {
        textTransform: "uppercase"
    },

    //SCREENS

    //HOME
    homeContainer: {
        marginHorizontal: 10,
        flex: 1,
        // justifyContent: "space-between",
    },
    homeBackground: {
        flex: 1,
        resizeMode: 'cover',
        flexDirection: 'column',
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT
    },
    homeTop: {
        paddingTop: isAndroid ? 20 : 50,
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardStackAction: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 20

    },
    cardStackButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: WHITE,
        marginHorizontal: 7,
        alignItems: "center",
        justifyContent: "center",
        elevation: 1,
        shadowOpacity: 0.15,
        shadowRadius: 20,
        shadowColor: DARK_GRAY,
        shadowOffset: { height: 10, width: 0 }
    },
    cardStackSmallButton: {
        width: 40,
        height: 40,
        borderRadius: 30,
        backgroundColor: WHITE,
        marginHorizontal: 7,
        alignItems: "center",
        justifyContent: "center",
        elevation: 1,
        shadowOpacity: 0.15,
        shadowRadius: 20,
        shadowColor: DARK_GRAY,
        shadowOffset: { height: 10, width: 0 } 
    },

    //MATCHES
    matchesBackground: {
        flex: 1,
        resizeMode: 'cover',
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT
    },
    matchesContainer: {
        justifyContent: 'space-between',
        flex: 1,
        paddingHorizontal: 10
    },
    matchesTop: {
        paddingTop: 50,
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    matchesTitle: {
        paddingBottom: 10, 
        fontSize: 22, 
        color: DARK_GRAY 
    },

    //PROFILE
    profileBackground: {
        flex: 1,
        resizeMode: "cover",
        width: WINDOW_WIDTH,
    },
    profileTop: {
        paddingTop: isAndroid ? 20 : 50,
        marginHorizontal: 20,
        flexDirection: "row-reverse",
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    //MESSAGES
    containerMessage: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        paddingHorizontal: 10,
        width: WINDOW_WIDTH - 100,
    },

    messageEmoji: {
        fontSize: 50
    },

    messageName: {
        fontSize: 20
    },
    title: { paddingBottom: 10, fontSize: 22, color: DARK_GRAY },

    //MODAL
    modalCenteredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalButton: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    modalButtonClose: {
        backgroundColor: "#2196F3",
    },
    modalTextStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
})