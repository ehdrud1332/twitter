import React, {useState, useEffect} from 'react';
import { dbService } from "../fbase";

const Home = ({ userObj }) => {

    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        // useEffect안에 넣은 이방식은 리로드 하지 않아도 바로 view에 표시된다. 전 방식은 리로드 해줘야하는 고전 방식
        // forEach 방식은 re-render 해야하는 불편함이 있다.
        dbService.collection("tweets").onSnapshot((snapshot) => {
            const tweetArray = snapshot.docs.map(doc => ({id: doc.id, ...doc.data(),}))
            setTweets(tweetArray)
        })
    }, [])

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("tweets").add({
            text: tweet,
            createAt: Date.now(),
            creatorId: userObj.uid
        });
        setTweet("");
    };
    const onChange = (event) => {
        const { target : {value}} = event;
        setTweet(value);
    }
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
                <input type='submit' value="twitter"/>
            </form>
            <div>
                {tweets.map(tweet =>
                    <div key={tweet.id}>
                        <h4>{tweet.text}</h4>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home;

