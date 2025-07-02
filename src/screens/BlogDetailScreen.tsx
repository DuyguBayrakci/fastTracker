import React, { useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Blog = {
  id: string;
  title: string;
  summary: string;
  image: any;
  content: string;
};

export default function BlogDetailScreen({
  route,
  navigation,
}: {
  route: { params: { blog: Blog } };
  navigation: any;
}) {
  const { blog } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: '#ff7043',
      headerTitleStyle: { color: '#ff7043', fontSize: 20 },
      headerBackTitle: 'Anasayfa',
    });
  }, [navigation]);

  useEffect(() => {
    return () => {
      navigation.navigate('Home', { readBlogId: blog.id });
    };
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Image source={blog.image} style={styles.image} />
      <Text style={styles.title}>{blog.title}</Text>
      <Text style={styles.content}>{blog.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  image: {
    width: '100%',
    height: 320,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  content: {
    fontSize: 16,
    color: '#444',
    paddingHorizontal: 16,
    marginBottom: 24,
    textAlign: 'left',
  },
});
