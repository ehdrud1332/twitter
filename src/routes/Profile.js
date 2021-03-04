import React, {useEffect, useState} from 'react';
import {authService, dbService} from "../fbase";
import { useHistory } from 'react-router-dom';

const Profile =  ({ userObj, refreshUser }) => {

    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)

    const history = useHistory();
    const onLogoutClick = () => {
        authService.signOut();
        history.push("/");
    }

    const getMyTweets = async() => {
        const tweets = await dbService
            .collection("tweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createAt")
            .get();
        console.log(tweets.docs.map((doc) => doc.data()))
    }

    useEffect(() => {
        getMyTweets();
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName
            })
            refreshUser();
        }
    };

    const onChange = (event) => {
        const {target: {value}} = event;
        setNewDisplayName(value)
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    onChange={onChange}
                    type="text"
                    placeholder="Display Name"
                    value={newDisplayName}
                />
                <input
                    type="submit"
                    value="Update Profile"
                />
            </form>
            <button onClick={onLogoutClick}>Log Out</button>
        </>
    )
}

export default Profile;
