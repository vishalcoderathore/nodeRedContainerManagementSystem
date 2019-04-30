
// Default filterReducer value
const filterReducerDefaultState = {
    sortBy: 'date', //date
};

const filterReducer = (state = filterReducerDefaultState, action) => {
    switch (action.type) {
        case 'SORT_BY_DATE':
            return {
                ...state,
                sortBy: 'date'
            }
        default:
            return state;
    }
};

export default filterReducer;