function logger(reducer) {
    return (prevState, action) => {
        console.group(action.type)
        console.log('PrevState',prevState)
        console.log('action',action)
        const newState = reducer(prevState,action)
        console.log('NextState',newState)
        console.groupEnd()
        return newState
    }
}

export default logger;