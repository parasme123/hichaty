import { useContext } from "react";
import AppContext from "../context/AppContext";
import firestore from "@react-native-firebase/firestore";
const usersCollection = firestore().collection("users");
const roomsCollection = firestore().collection("rooms");

// CREATE NEW ROOM :
export const createNewRoom = async (userId, targetId) => {
    // create new room
    const docRef = await roomsCollection.add({
        participants: [userId, targetId], 
        temporary: false, 
        audio: {
            answer: "",
            from: "",
            offer: "",
            type: ""
        },
        video: {
            answer: "",
            from: "",
            offer: "",
            type: ""
        }
    });

    // create batch
    let batch = firestore().batch();

    const userRef = usersCollection.doc(userId);
    await batch.update(userRef,
        {
            friends: firestore.FieldValue.arrayUnion(targetId),
            groups: firestore.FieldValue.arrayUnion(`/rooms/${docRef.id}`),
            history: firestore.FieldValue.arrayUnion(`/history/${docRef.id}`)
        })

    const targetRef = usersCollection.doc(targetId);
    await batch.update(targetRef,
        {
            friends: firestore.FieldValue.arrayUnion(userId),
            groups: firestore.FieldValue.arrayUnion(`/rooms/${docRef.id}`),
            history: firestore.FieldValue.arrayUnion(`/history/${docRef.id}`)
        })

    await batch.commit();

    return Promise.resolve(docRef.id);
}

// SAVE TOKEN TO DATABSE FOR FCM MESSAGES:
export const saveTokeToDatabase = async (id, token) => {
    await usersCollection.doc(id)
        .update({ tokens: firestore.FieldValue.arrayUnion(token), fcbToken: token })
        .catch((e) => console.log('form there', e));
}

// export const showToast = (msg) => {
//     if (msg) {
//         Toast.show(msg, {
//             duration: 2000,
//             position: Toast.positions.TOP,
//             shadow: true,
//             animation: true,
//             hideOnPress: true,
//             delay: 0,
//         });
//     }
// }



