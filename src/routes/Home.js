import React, {useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from "../fbase";
import Tweet from "../components/Tweet";
import TweetFactory from "../components/TweetFactory";

const Home = ({ userObj }) => {
    //여기서 onSubmit을 위한 state
    const [tweets, setTweets] = useState([]);

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
    return (
        <div className="container">
            <TweetFactory userObj={userObj}/>
            <div style={{ marginTop: 30 }}>
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

