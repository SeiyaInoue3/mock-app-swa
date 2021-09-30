import React , { useState, useEffect, memo }　from "react";
import { ulid } from "ulid";
import axios from "axios";

import { Container, Heading, Button, ListItem, Text, VStack, HStack, Flex, IconButton, List, Spacer, Input } from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const URL = "https://polite-desert-00d2b2b00.azurestaticapps.net/api/func-create-cosmos-data";
const databaseURL = "https://polite-desert-00d2b2b00.azurestaticapps.net/api/func-get-cosmos-data";

// タイトルコンポーネント
const Title = memo(({title, as, fontSize, mt}) => {
  return (
    <Heading mt={mt} as={as} fontSize={fontSize} w="full">{title}</Heading>
  );
});

// 各Postのコンポーネント
const PostItem = ({post}) => {

  // + Likeボタンのアクション関数
  const initialCount = Number(post.likes_num);
  const [count, setCount] = useState(initialCount);
  const handleClickLike = () => {
    // countに1を足す
    const countAdd = () => {
      setCount((prevCount) => prevCount + 1);
      console.log(initialCount);
    };
    countAdd();
    
    // クエリ内容の定義
    const paramsId = post.id;
    const paramsName = post.name;
    const paramsContent = post.content;
    const paramsLikesNum = count;

    // FunctionsにGETリクエストしてcosmosDBにデータ格納
    const fetchData = async () => {
      const response = await axios.get(URL,{params:{"id": paramsId, "name": paramsName, "content": paramsContent, "likes_num": paramsLikesNum}});
      console.log(paramsLikesNum);
    };
    fetchData();
  };

  return (
    <ListItem borderWidth="1px" p="4" mt="4" bg="white" borderRadius="md" borderColor="gray.300">
      <Flex >
        <Text as="u" mb="1">{post.name}</Text>
        <Spacer />
        <Text mb="1">Likes: {count}</Text>
      </Flex>
      <Text p="2" mb="10">{post.content}</Text>
      <Flex align="center" justify="flex-end">
        <Button colorScheme="pink" variant="outline" size="sm" onClick={handleClickLike}>+ Like</Button>
        <IconButton icon={<DeleteIcon />} variant="unstyled" size="sm" aria-label="delete" />
      </Flex>
    </ListItem>
  )
};

// Post一覧のコンポーネント
const PostList = ({title, as, fontSize, postList}) => {
  return (
    <>
      {postList.length !== 0 && (
        <>
          <Title title={title} as={as} fontSize={fontSize} mt="12" />
          <List w="full">
            {postList.map((item) => (
              <PostItem post={item} key={item.id} />
            ))}
          </List>
        </>
      )}
    </>
  );
};

function App() {

  // サイトを開いた時にcosmosDBから取得したデータ一覧の表示
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(databaseURL);
      setPosts(response.data.reverse());
    };
    fetchData();
  }, []);

  // 投稿内容の記入
  // 入力中のテキストの状態とその状態を更新する関数
  const [inputName, setInputName] = useState("");
  // onChangeでinputContentの状態（入力状態)を更新するイベントバンドラ
  const handleChangeName = (e) => setInputName(e.target.value);

  // 投稿内容の記入
  // 入力中のテキストの状態とその状態を更新する関数
  const [inputContent, setInputContent] = useState("");
  // onChangeでinputContentの状態（入力状態)を更新するイベントバンドラ
  const handleChangeContent = (e) => setInputContent(e.target.value);

  // Post!ボタンをクリックした時のアクション
  const handleClickPost = () => {
    setInputName("");
    setInputContent("");

    // クエリ内容の定義
    const paramsId = ulid();
    const paramsName = inputName;
    const paramsContent = inputContent;
    const paramsLikesNum = 0;

    // FunctionsにGETリクエストしてcosmosDBにデータ格納
    const fetchData = async () => {
      const response = await axios.get(URL,{params:{"id": paramsId, "name": paramsName, "content": paramsContent, "likes_num": paramsLikesNum}})
    };
    fetchData();

    // 投稿一覧に反映
    const newPost = {"id": paramsId, "name": paramsName, "content": paramsContent, "likes_num": paramsLikesNum};
    posts.unshift(newPost);
  };

  return (
    <Container conterContent p={{ base: "4", md: "6" }} maxWidth="3xl">
      <Title title="mock app SNS" as="h1" fontSize={{ base: "2xl", md: "3xl" }}/>
      <VStack p="4" mt="4" spacing={3}>
        <Input placeholder="Enter your nickname!" size="sm" bg="white" type='text' value={inputName} onChange={handleChangeName} />
        <Input placeholder="What's in your mind?" size="lg" bg="white" type='text' value={inputContent} onChange={handleChangeContent} />
        <Button onClick={handleClickPost} colorScheme="blue" leftIcon={<AddIcon />} mt="8">Post!</Button>
      </VStack>
      <PostList title="Post List" as="h2" fontSize={{ base: "xl", md: "2xl" }} postList={posts} />
    </Container>
  )
};

export default App;
