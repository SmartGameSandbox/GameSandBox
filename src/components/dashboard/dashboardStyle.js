const styles = {
    body: {
        display: "flex",
        flexDirection: 'column',
        height: "100%",
    },
    main: {
        width: "100%",
        height: "100%",

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnGroup: {
        boxSizing: "border-box",
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
        gridRow: "1 / span 1",
        display: 'flex',
        width: "100%",
        height: "50%"
    },
    joinBtn: {
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        height: "100%",
        width: '20%',
        boxShadow: 'unset',
        fontSize: '1.5em',
    },
    linkField: {
        width: "100%",
        alignItems: 'center',
        borderTopRightRadius: "15px",
        borderBottomRightRadius: "15px",

        '& *': {
            borderTopRightRadius: "15px",
            borderBottomRightRadius: "15px",
        },
        '& > div': {
            height: "100%",
            width: "100%",
            borderTopRightRadius: "15px",
            borderBottomRightRadius: "15px",
        }
    },
    hostRoom: {
        gridColumn: "1 / span 1",
        gridRow: "2 / span 2",
        width: "100%", height: "100%",

        fontSize: '6em'
    },
    buildRoom: {
        gridColumn: "2 / span 1",
        gridRow: "2 / span 1",
        width: "100%", height: "100%",
        justifySelf: 'left',

        fontSize: '4em'
    },
    myGames: {
        gridColumn: "2 / span 1",
        gridRow: "3 / span 1",
        width: "100%", height: "100%",
        justifySelf: 'left',

        fontSize: '3em'
    }
}

export default styles