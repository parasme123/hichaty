import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';


const presenceDetection = (user) => {
    var uid = user.id;
    var userStatusDatabaseRef = database().ref('/status/' + uid);
    var userStatusFirestoreRef = firestore().collection('status').doc(uid);

    var isOfflineForDatabase = {
        state: 'offline',
        last_changed: database.ServerValue.TIMESTAMP,
    };

    var isOnlineForDatabase = {
        state: 'online',
        last_changed: database.ServerValue.TIMESTAMP,
    };

    var isOfflineForFirestore = {
        state: 'offline',
        last_changed: firestore.FieldValue.serverTimestamp(),
    };

    var isOnlineForFirestore = {
        state: 'online',
        last_changed: firestore.FieldValue.serverTimestamp(),
    };

    database().ref('.info/connected').on('value', function(snapshot) {
        if (snapshot.val() == false) {
            // Instead of simply returning, we'll also set Firestore's state
            // to 'offline'. This ensures that our Firestore cache is aware
            // of the switch to 'offline.'
            userStatusFirestoreRef.set(isOfflineForFirestore);
            return;
        };

        userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
            userStatusDatabaseRef.set(isOnlineForDatabase);

            // We'll also add Firestore set here for when we come online.
            userStatusFirestoreRef.set(isOnlineForFirestore);
        });
    });
    
}
export default presenceDetection;