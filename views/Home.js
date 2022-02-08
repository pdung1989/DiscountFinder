import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Searchbar } from "react-native-paper";
import RecentButton from "../components/RecentButton";
import CategoryBox from "../components/CategoryBox";
import { Dimensions } from "react-native";

const Home = ({navigation}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query) => setSearchQuery(query);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profile}>
            <View>
              <Text style={styles.headerTitle}>Welcome back,</Text>
              <Text
                style={styles.headerUser}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                Tamas
              </Text>
            </View>
            <Image
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnzCc4_HnkhhWPouqsYT42QDguYx2Qwjzrlg&usqp=CAU",
              }}
              style={styles.profilePic}
            />
          </View>
          <Searchbar
            style={styles.searchBar}
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
        </View>
        <ScrollView>
          <RecentButton></RecentButton>
          <Text style={styles.title}>Categories</Text>
          <View style={styles.categories}>
            <CategoryBox
              icon={require("../assets/salad.png")}
              color={"#E74F54"}
              title={"Food"}
              side={"left"}
            ></CategoryBox>
            <CategoryBox
              icon={require("../assets/clothes.png")}
              color={"#62BFC3"}
              title={"Clothing"}
              side={"right"}
            ></CategoryBox>
            <CategoryBox
              icon={require("../assets/furniture.png")}
              color={"#467599"}
              title={"Furniture"}
              side={"left"}
            ></CategoryBox>
            <CategoryBox
              icon={require("../assets/vacations.png")}
              color={"#F8B148"}
              title={"Vacation"}
              side={"right"}
            ></CategoryBox>
          </View>
        </ScrollView>
      </View>
      <StatusBar style="dark" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
  },
  header: {
    paddingTop: 37,
    paddingBottom: 30,
    paddingLeft: 17,
    paddingRight: 17,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: "#efefef",
  },
  profile: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#1D3354",
    fontSize: 28,
  },
  headerUser: {
    color: "#1D3354",
    fontWeight: "600",
    alignSelf: "stretch",
    fontSize: 28,
    width: Dimensions.get("window").width - 90 - 17 - 17,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 100,
    marginTop: 10,
    marginBottom: 10,
  },
  searchBar: {
    marginTop: 20,
    borderRadius: 15,
    shadowOpacity: 0.1,
  },
  title: {
    marginLeft: 17,
    fontSize: 24,
    color: "#1D3354",
    fontWeight: "600",
  },
  categories: {
    flexWrap: "wrap",
    flexDirection: "row",
    marginLeft: 17,
    marginRight: 17,
    marginTop: 12,
  },
});

export default Home;
