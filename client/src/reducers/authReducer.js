export default (state = {userLoggedIn: false}, action) => {
    switch (action.type) {
        case 'LOGIN':
            console.log("User Logged In");
            console.log("From action.userId: ,", action.userId);
            return {
                userLoggedIn: true,
                userId: action.userId,
                userName: action.userName,
            };
        case 'LOGOUT':
            console.log("User Logged Out");
            return {userLoggedIn: false};
        default:
            return state;
    }
};