import { Route } from 'react-router-dom';
import withRedirectIfNotLoggedIn from '../higherOrder/withRedirectIfNotLoggedIn';

export default withRedirectIfNotLoggedIn(Route);