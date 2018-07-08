import {
    LOG_IN, 
    LOG_OUT,
    SET_CARDS,
    UPDATE_CARD_PRIORITY
} from 'redux/actions.js'


const initState = {
    generalState: {
        loggedIn: false
    },
    cardSetState: {
        cards: []
    }

}


const reducer = (state=initState, action) => {
    return({
        generalState: generalReducer(state.generalState, action),
        cardSetState: cardSetReducer(state.cardSetState, action) 

    })
}

const generalReducer = (state, action) => {
    switch(action.type) {
        case LOG_IN:
            return Object.assign({}, state, {
                loggedIn: true
            })
        case LOG_OUT:
            return Object.assign({}, state, {
                loggedIn: false
            })
        default:
            return state
    }

}



const cardSetReducer = (state, action) => {
    switch(action.type) {
        case SET_CARDS:
            return {
                cards: action.cards
            }
        case UPDATE_CARD_PRIORITY:
            let index = action.index
            let card = state.cards[index]
            let newCard = Object.assign({}, card, {priority: action.priority})
            return {
                cards: Object.assign([...state.cards], {[index]: newCard})
            }

        default: 
            return state
    }
}




export default reducer; 