/**
 * 
 * @param {*} data_json 
 * @returns 
 */
export const addSquare = async (data_json) => {
    return await fetch('squares/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_json)
    })
    .then(async (res) => {
        let data = await res.json()
        if (res.status === 200) {
            window.console.log("Successfully added square");
            return data;
        } else {
            console.error("Error adding square: ", data.msg)
            return {err: data.msg}
        }
    })
    .catch(err => {
        console.error("Error creating square")
        console.error(err)
        return {err: "Error creating square"}
    })
}

export const getSquares = async () => {
    return await fetch('squares/get', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        let data = await res.json()
        if (res.status === 200) {
            window.console.log("Successfully retrieved squares");
            return data;
        } else {
            console.error("Error retrieving squares: ", data.msg)
            return {err: data.msg}
        }
    })
    .catch(err => {
        console.error("Error retrieving squares")
        console.error(err)
        return {err: "Error retrieving squares"}
    })
}

export const findSquares = async (coordinates) => {
    return await fetch('squares/find/' + coordinates, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        let data = await res.json()
        if (res.status === 200) {
            window.console.log("Successfully found squares");
            return data;
        } else {
            console.error("Error finding squares: ", data.msg)
            return {err: data.msg}
        }
    })
    .catch(err => {
        console.error("Error finding squares")
        console.error(err)
        return {err: "Error finding squares"}
    })
}

export const updateSquare = async (data_json) => {
    return await fetch('squares/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_json)
    })
    .then(async (res) => {
        let data = await res.json()
        if (res.status === 200) {
            window.console.log("Successfully updated square");
            return data;
        } else {
            console.error("Error updating square: ", data.msg)
            return {err: data.msg}
        }
    })
    .catch(err => {
        console.error("Error updating square")
        console.error(err)
        return {err: "Error updating square"}
    })
}
