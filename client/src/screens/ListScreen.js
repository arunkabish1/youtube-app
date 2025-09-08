import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import axios from 'axios';
import VideoItem from '../components/VideoItem';

const SERVER_BASE = 'https://your-server.onrender.com';


export default function ListScreen({ navigation }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${SERVER_BASE}/videos`)
      .then(res => setVideos(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{flex:1}} />;

  return (
    <SafeAreaView style={{flex:1}}>
      <FlatList
        data={videos}
        keyExtractor={item => item.videoId}
        renderItem={({item}) => (
          <VideoItem
            video={item}
            onPress={() => navigation.navigate('Player', { videoId: item.videoId, title: item.title })}
          />
        )}
      />
    </SafeAreaView>
  );
}
