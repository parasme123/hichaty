import auth from '@react-native-firebase/auth';
import { useContext } from 'react';
import AppContext from '../context/AppContext';


const SignOut = () => {

    const { user, setUser } = useContext(AppContext);
    auth
        .SignOut()
        .then( () => setUser(null) )
}