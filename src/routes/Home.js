import React, {useState} from 'react';

export default () => {

    const [tweet, setTweet] = useState("");

    const onSubmit = (event) => {
        event.preventDefault();
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
        </div>
    )
}

