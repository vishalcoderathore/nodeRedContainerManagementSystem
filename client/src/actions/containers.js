//Get Containers
export const getContainers = (container) => ({type: 'GET_CONTAINER', container:container});

// Create new Container
export const createContainer = (container) => ({type: 'CREATE_CONTAINER', container: container});

// Delete one or many containers
export const deleteContainers = (containersToRemove) => ({type: 'DELETE_CONTAINER', container: containersToRemove});

// Stop one or many containers
export const stopContainers = (containersToStop) => ({type: 'STOP_CONTAINER', container: containersToStop});

// Restart a container
export const restartContainer = (containerToRestart) => ({type: 'RESTART_CONTAINER', container: containerToRestart});

// Log In User
export const logInUser = (userId, userName) => ({type: 'LOGIN', userId: userId, userName: userName});

// Log Out User
export const logOutUser = () => ({type: 'LOGOUT'});