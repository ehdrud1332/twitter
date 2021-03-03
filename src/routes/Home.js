import React, {useState, useEffect} from 'react';
import { dbService } from "../fbase";

export default () => {

    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);

    const getTweets = async() => {
        // state에 있는 각각의 documents.data()를 console.log 하고 있다.
        const dbtTweets = await dbService.collection("tweets").get();
        // 모든 이전 tweets에 대해 배열을 return 할건데 그 배열안에는 새로작성한 tweets & ...prev(그 이전의 것)
        // set~~~ 을 쓸때 값 대신 함수를 전달 할 수 있다. 함수를 전달하면 react는 이전 값에 접근할 수 있게 해줌.
        dbtTweets.forEach(document => {
            const tweetsObject = {
                ...document.data(),
                id : document.id
            }
            setTweets((prev) => [tweetsObject, ...prev])
        })
    }

    useEffect(() => {
        getTweets()
    }, [])

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("tweets").add({
            tweet,
            createAt: Date.now()
        });
        setTweet("");
    };
    const onChange = (event) => {
        const { target : {value}} = event;
        setTweet(value);
    }
    console.log(tweets)
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
                        <h4>{tweet.tweet}</h4>
                    </div>
                )}
            </div>
        </div>
    )
}

