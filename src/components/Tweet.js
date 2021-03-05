import React, {useState} from 'react';
import {dbService, storageService} from "../fbase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Tweet = ({ tweetObj, isOwner }) => {
    // edit을 할 수 있거나 없게 도와주는 state
    const [editing, setEditing] = useState(false);
    // input 입력된 Text를 업데이트 해주는 state
    const [newTweet, setNewTweet] = useState(tweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this tweet?")
        if(ok) {
            // 삭제할 수 있는 있유는 documents(doc).id를 알고 있었기 때문.
            // collection안에 있는 documents id를 얻어낸 다음에 삭제하는 것.
            await dbService.doc(`tweets/${tweetObj.id}`).delete();
            await storageService.refFromURL(tweetObj.attachmentUrl).delete();
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    const onSubmit = async (event) => {
        event.preventDefault();
        //
        await dbService.doc(`tweets/${tweetObj.id}`).update({
            // newTweet는 input에 있는 Text를 말함.
            text: newTweet
        })
        setEditing(false)
    };

    const onChange = (event) => {
        const {target: {value}} = event;
        setNewTweet(value)
    };

    return (
        <div className="nweet">
            {editing ? (
            <>
                <form onSubmit={onSubmit} className="container nweetEdit">
                    <input
                        type="text"
                        placeholder="Edit your Tweet"
                        value={newTweet}
                        required
                        autuFocus
                        onChange={onChange}
                        className="formInput"
                    />
                    <input
                        type="submit"
                        value="Update Tweet"
                        className="formBtn cancelBtn"
                    />
                </form>
                <span onClick={toggleEditing} className="formBtn cancelBtn">
                    Cancel
                </span>
            </>
            ) : (
            <>
                <h4>{tweetObj.text}</h4>
                {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl}/>}
                {isOwner && (
                    <div className="nweet__actions">
                        <span onClick={onDeleteClick}>
                            <FontAwesomeIcon icon={faTrash} />
                        </span>
                        <span onClick={toggleEditing}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                    </div>
                )}
            </>
            )
            }
        </div>
    )

}

export default Tweet;
