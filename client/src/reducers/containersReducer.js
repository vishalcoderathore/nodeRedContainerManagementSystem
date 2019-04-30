// Default containersReducer value
const containersReducerDefaultState = [];

const containersReducer = (state = containersReducerDefaultState, action) => {
    let stateArray = [...state];

    switch (action.type) {
        case 'GET_CONTAINER':            
            return action.container;
        case 'CREATE_CONTAINER':
            console.log("Switch create_container case");
            console.log(action.container);
            return [
                ...state,
                action.container
            ];
        case 'DELETE_CONTAINER':
            stateArray = [...state];
            const containersToRemove = action.container;
            let newArr = [];
            if (containersToRemove.length !== stateArray.length) {
                for (var x = 0; x < containersToRemove.length; x++) {
                    newArr = stateArray.filter((e) => {
                        return e.Id !== containersToRemove[x];
                    });
                }
                return newArr;
            } else {
                return containersReducerDefaultState;
            }
        case 'STOP_CONTAINER':
            stateArray = [...state];
            const containersToStop = action.container;
            for (var x = 0; x < containersToStop.length; x++) {
                stateArray.map((e) => {
                    if (e.Id === containersToStop[x]) {
                        e.State.Status = e
                            .State
                            .Status
                            .toString()
                            .replace("running", "exited");
                    }
                });
            } // also can be done using spread operator
            return stateArray;
        case 'RESTART_CONTAINER':
            let stateArray = [...state];
            for (var x = 0; x < stateArray.length; x++) {
                stateArray.map((e) => {
                    if (e.Id === action.container) {
                        e.State.Status = "running";
                    }
                });
            }
            return stateArray;
        default:
            console.log("Switch default case");
            return state;
    }
};

export default containersReducer;