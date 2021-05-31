import { compose, withState, lifecycle, withHandlers } from 'recompose'

const enhance = compose(
  withState('hasError', 'setHasError', false),
  lifecycle({
    componentDidCatch(error, errorInfo) {
      const { setHasError } = this.props
      setHasError(true);
      //logErrorToServer(error, errorInfo)
    },
  })
);

export default enhance
