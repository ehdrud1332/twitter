import React, {useState} from 'react';
import {dbService, storageService} from "../fbase";
import { v4 as uuidv4 } from 'uuid';

const TweetFactory = ({ userObj}) => {

    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`)
            const response = await attachmentRef.putString(attachment, 'data_url');
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const tweetObj = {
            text: tweet,
            createAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        };
        await dbService.collection("tweets").add(tweetObj);
        setTweet("");
        setAttachment("");
    };
    const onChange = (event) => {
        const { target : {value}} = event;
        setTweet(value);
    }

    const onFileChange = (event) => {
        //  es6 evnet 안에있는 target 안에있는 files을 상수화 한것.
        // fileReader API 사용한다.
        const {target: {files}} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: {result}} = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile)
    }

    const onClearAttachment = () => setAttachment(null)

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    value={tweet}
                    onChange={onChange}
                    type='text'
                    placeholder="What's on your mind"
                    maxLength={120}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                />
                <input type='submit' value="tweet"/>
                {attachment &&
                <div>
                    <img src={attachment} width='50px' height='50px'/>
                    <button onClick={onClearAttachment}>Clear</button>
                </div>}

            </form>
        </div>
    );
};

export default TweetFactory;
