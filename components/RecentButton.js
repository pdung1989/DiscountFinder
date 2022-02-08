import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { EvilIcons } from "@expo/vector-icons";

const RecentButton = ({navigation}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RecentPosts')}>
      <Text style={styles.recentText}>Recent posts</Text>
      <EvilIcons name="arrow-right" size={40} color="#fdfdfd" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#467599",
    height: 70,
    borderRadius: 15,
    marginTop: 20,
    marginLeft: 17,
    marginRight: 17,
    marginBottom: 30,
    paddingLeft: 10,
    paddingRight: 10,
  },
  recentText: {
    color: "#fdfdfd",
    fontSize: 24,
    fontWeight: "600",
  },
});

export default RecentButton;
