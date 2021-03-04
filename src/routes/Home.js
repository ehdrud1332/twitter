import React, {useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from "../fbase";
import Tweet from "../components/Tweet";

const Home = ({ userObj }) => {
    //여기서 onSubmit을 위한 state
    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    useEffect(() => {
        // useEffect안에 넣은 이방식은 리로드 하지 않아도 바로 view에 표시된다. 전 방식은 리로드 해줘야하는 고전 방식
        // forEach 방식은 re-render 해야하는 불편함이 있다.
        // onSnapshot은 database에 무슨일이 있을때(listener) 알림을 받는다.
        // 새로운 snapshot을 받을때 tweetArray를 생성한다.
        // 그런 다음에 state에 배열을 집어 넣는다.
        dbService.collection("tweets").onSnapshot((snapshot) => {
            const tweetArray = snapshot.docs.map(doc => ({id: doc.id, ...doc.data(),}))
            setTweets(tweetArray)
        })
    }, [])

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
            <div>
                {tweets.map(tweet =>
                    <Tweet
                        key={tweet.id}
                        // tweetObj를 제공했기 때문에 delete가 id를 기반으로 삭제를 할 수 있다
                        tweetObj={tweet}
                        isOwner={tweet.creatorId === userObj.uid}
                    />
                )}
            </div>
        </div>
    )
}

export default Home;

