const styles = {
    main: {
        width: "100%",
        height: "100%",
        // backgroundColor: 'burlywood',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnGroup: {
        boxSizing: "border-box",
        // backgroundColor: 'white',
        width: "80%",
        height: "80%",
        display: 'grid',
        gridTemplateColumns: "49% 49%",
        gridTemplateRows: "20% 46% 30%",
        padding: "2%",
        gridGap: "2%",
        justifyItems: 'center'
    },
    joinRoom: {
        gridColumn: "1 / span 2",
        gridRow: "1 / span 1"
    },
    joinBtn: {

    },
    linkField: {
        borderTopRightRadius: "0px"
    },
    hostRoom: {
        gridColumn: "1 / span 1",
        gridRow: "2 / span 2",
        width: "100%", height: "100%",

        fontSize: '8em'
    },
    buildRoom: {
        gridColumn: "2 / span 1",
        gridRow: "2 / span 1",
        width: "100%", height: "100%",
        justifySelf: 'left',

        fontSize: '6em'
    },
    myGames: {
        gridColumn: "2 / span 1",
        gridRow: "3 / span 1",
        width: "100%", height: "100%",
        justifySelf: 'left',

        fontSize: '6em'
    }
}

export default styles