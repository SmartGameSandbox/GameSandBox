// create id
module.exports = (IDLength) => {
    let id = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    for (let i = 0; i < IDLength; ++i) {
        id += characters.charAt(Math.floor(Math.random() * 36));
    }
    return id;
}

