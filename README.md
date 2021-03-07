## 주요기능

* React JS를 이용한 Twitter 기능 구현
* Firebase API 를 이용한 CRUD 기능 구현
* FileReader API 를 이용한 image Reader 기능 구현
* Hook(useState, useEffect, useHistory etc..)을 활용한 코드 생성
* 모바일 친화적 화면 구현

## 완성화면

|Feature|Photo|Description|
|--|--|--|
|Feature1|<img src="https://user-images.githubusercontent.com/60862525/110229167-e28b0080-7f4a-11eb-8794-786a966ba6f5.png" width=250 />|**AuthScreen**</br>Firebase API를 이용한 local Sign In, Sign Up </br> Google, Github Social Login 구현|
|Feature2|<img src="https://user-images.githubusercontent.com/60862525/110229419-9b9e0a80-7f4c-11eb-97f5-41466c8370e6.png" width=250 />|**HomeScreen**</br>FileReader API를 이용한 image Reading & image Upload</br> FileReader API를 이용해 얻는 URL를 Firebase에 Upload|
|Feature3|<img src="https://user-images.githubusercontent.com/60862525/110229524-71008180-7f4d-11eb-9a84-18222e21d96e.png" width=250 />|**ProfileScreen**</br>Profile 수정 및 LogOut 구현 </br>|
|Feature4|<img src="https://user-images.githubusercontent.com/60862525/110229618-321efb80-7f4e-11eb-8192-55ca94d3997d.gif" width=250 />|**Tweeting**</br> Tweet 업로드 및 업데이트, 삭제 구현 </br> uuid API를 이용힌 Tweet 암호화 </br>Firebase API를 이용한 Collection 생성과 함께 원하는 데이터 업로드|

## Study Note

#### 1. 소셜 로그인 구현 (Google, github)
~~~ts
const onSocialClick = async (event) => {
        const {target: {name}} = event;
        let provider;
        if (name === 'google') {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if (name === 'github') {
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        const data = await authService.signInWithPopup(provider);
        console.log(data)
    }
~~~

#### 2. onSnapshot의 코드 구현
* Hook 코드안에 onSnapshot 기능 넣기
* forEach, onSnapshot 두 가지 방법을 구현 후 장단점 확인
* onSnapshot의 listenter 역할 확인
* onSnapshot은 database에 무슨일이 있을때(listener) 알림을 받고 새로운 snapshot을 받을때 tweetArray를 생성 후 state에 배열을 넣는다.
~~~ts
useEffect(() => {
        dbService.collection("tweets").onSnapshot((snapshot) => {
            const tweetArray = snapshot.docs.map(doc => ({id: doc.id, ...doc.data(),}))
            setTweets(tweetArray)
        })
    }, [])
~~~

#### 3. fileReader API 코드 작성
* ES6을 이용한 코드 생성
* 파일은 읽은 후 DATA URL 저장
~~~ts
 const onFileChange = (event) => {
        const {target: {files}} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: {result}} = finishedEvent;
            setAttachment(result);
        };
        if (Boolean(theFile)) {
            reader.readAsDataURL(theFile);
        }
    }
~~~

#### 4. Delete 이해하기
* id을 이용한 CRUD 활용법
* delete 하는 방법에 대한 이해
~~~ts
   const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this tweet?")
        if(ok) {
            // 삭제할 수 있는 있유는 documents(doc).id를 알고 있었기 때문.
            // collection안에 있는 documents id를 얻어낸 다음에 삭제하는 것.
            await dbService.doc(`tweets/${tweetObj.id}`).delete();
            await storageService.refFromURL(tweetObj.attachmentUrl).delete();
        }
    };
~~~

## To Do List

- [ ] BackEnd에 대한 이해도 높이기
- [ ] 다양한 API에 대한 영어 원문 이용법 공부하기 
