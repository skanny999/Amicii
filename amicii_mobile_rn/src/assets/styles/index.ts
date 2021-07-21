import { StyleSheet, Dimensions } from 'react-native'

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
    cardItemEmoji: {
        paddingTop: 30,
        fontSize: 120,
        textAlign: 'center'
    },
    cardItemBio: {
        color: GRAY,
        textAlign: 'center',
        height: WINDOW_WIDTH * 0.75 / 4
    },
    cardItemAction: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 30
    },
    cardItemButton: {
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
    cardItemSmallButton: {
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

    //FILTERS
    filtersGeneral: {
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
    filtersText: {
        color: DARK_GRAY,
        fontSize: 13,
        textAlign: 'center'
    },
    
    //LOCATION
    locationGeneral: {
        backgroundColor: WHITE,
        borderRadius: 20,
        width: 100,
        elevation: 1,
        padding: 10,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowColor: BLACK,
        shadowOffset: {height: 0, width: 0}
    },
    locationText: {
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
        marginHorizontal: 10
    },
    homeBackground: {
        flex: 1,
        resizeMode: 'cover',
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT
    },
    homeTop: {
        paddingTop: 50,
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
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
        height: WINDOW_HEIGHT,
    },
    profileTop: {
        paddingTop: 50,
        marginHorizontal: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
})