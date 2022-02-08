import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { PropTypes } from "prop-types";

const CategoryBox = ({ icon, color, title, side }) => {
  return (
    <TouchableOpacity style={styles(color, side).box}>
      <Text style={styles().text}>{title}</Text>
      <Image style={styles().image} source={icon}></Image>
    </TouchableOpacity>
  );
};

const styles = (color, side) =>
  StyleSheet.create({
    box: {
      width: "48%",
      height: 160,
      borderRadius: 20,
      backgroundColor: color,
      marginBottom: "4%",
      marginRight: side === "left" ? "2%" : "0%",
      marginLeft: side === "right" ? "2%" : "0%",
    },
    text: {
      marginLeft: 10,
      marginTop: 15,
      fontSize: 22,
      color: "#fdfdfd",
      fontWeight: "600",
    },
    image: {
      width: 100,
      height: 100,
      position: "absolute",
      bottom: 2,
      right: 2,
    },
  });

CategoryBox.propTypes = {
  icon: PropTypes.func,
  color: PropTypes.func,
  title: PropTypes.func,
  side: PropTypes.string,
};

export default CategoryBox;
