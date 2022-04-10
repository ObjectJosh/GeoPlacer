/**
 * 
 * @param {*} data_json 
 * @returns 
 */
 export const addUser = async (data_json) => {
    return await fetch('users/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_json)
    })
    .then(async (res) => {
        let data = await res.json()
        if (res.status === 200) {
            window.console.log("Successfully added user");
            return data;
        } else {
            console.error("Error adding user: ", data.msg)
            return {err: data.msg}
        }
    })
    .catch(err => {
        console.error("Error creating square")
        console.error(err)
        return {err: "Error creating square"}
    })
}

// export const getSquares = async () => {
//     return await fetch('squares/get', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(async (res) => {
//         let data = await res.json()
//         if (res.status === 200) {
//             window.console.log("Successfully retrieved squares");
//             return data;
//         } else {
//             console.error("Error retrieving squares: ", data.msg)
//             return {err: data.msg}
//         }
//     })
//     .catch(err => {
//         console.error("Error retrieving squares")
//         console.error(err)
//         return {err: "Error retrieving squares"}
//     })
// }

export const findUser = async (id) => {
    return await fetch('users/find/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        let data = await res.json()
        if (res.status === 200) {
            window.console.log("Successfully found user");
            return data;
        } else {
            console.error("Error finding user: ", data.msg)
            return {err: data.msg}
        }
    })
    .catch(err => {
        console.error("Error finding user")
        console.error(err)
        return {err: "Error finding user"}
    })
}

export const updateUser = async (data_json) => {
    return await fetch('users/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_json)
    })
    .then(async (res) => {
        let data = await res.json()
        if (res.status === 200) {
            window.console.log("Successfully updated user");
            return data;
        } else {
            console.error("Error updating user: ", data.msg)
            return {err: data.msg}
        }
    })
    .catch(err => {
        console.error("Error updating user")
        console.error(err)
        return {err: "Error updating user"}
    })
}
