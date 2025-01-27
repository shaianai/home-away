import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, StyleSheet, Dimensions, FlatList, TouchableOpacity } from "react-native";

const { width, height } = Dimensions.get('screen');

const messages = [
    { id: "1", sender: "Hernz Ramos", content: "Hey, how are you?", time: "10:30 AM" },
    { id: "2", sender: "Josh", content: "Hey, how are you?", time: "10:30 AM" },
    { id: "3", sender: "Hernz Ramos", content: "Hey, how are you?", time: "10:30 AM" },
    { id: "4", sender: "Josh", content: "Hey, how are you?", time: "10:30 AM" },

];

export default function MessageScreen() {
    const [searchMessage, setSearchMessage] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.redcontainer}></View>
            <View style={styles.whitecontainer}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search message"
                        placeholderTextColor="gray"
                        value={searchMessage}
                        onChangeText={setSearchMessage}
                    />
                </View>

                <Text style={styles.title}>Messages</Text>

                <View style={styles.messageContainer}>
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                                <TouchableOpacity style={styles.messageCard}>
                                    <View style={styles.messageDetails}>
                                        <Text style={styles.sender}>{item.sender}</Text>
                                        <Text style={styles.content} numberOfLines={1}>{item.content}</Text>
                                    </View>
                                    <View style={styles.timeDetails}>
                                        <Text style={styles.time}>{item.time}</Text>
                                    </View>
                                </TouchableOpacity>
                        )}
                        scrollEnabled={messages.length > 2}
                        contentContainerStyle={{ flexGrow: 1 }}
                        ListFooterComponent={<View style={styles.footerSpace} />} 
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#D12E2E',
        flex: 1,
        alignItems: 'center',
    },

    redcontainer: {
        backgroundColor: '#D12E2E',
        height: 40,
    },

    whitecontainer: {
        flex: 1,
        width: width*1,
        height: height * 1,
        backgroundColor: '#fff',
        padding: 10,
    },

    searchContainer: {
        alignItems: 'center',
    },

    searchBar: {
        backgroundColor: '#fff',
        width: 250,
        height: 40,
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#909090',
        marginTop: 15,
        paddingLeft: 20,
        alignItems: 'center',
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 20,
        marginLeft: 10,
    },

    messageContainer: {
        flex: 1,
        marginTop: 15,
    },

    messageCard: {
        width: '100%',
        height: 60,
        padding: 5,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
    },

    messageDetails: {
        paddingLeft: 50,
    },

    sender: {
        fontWeight: 'bold',
        fontSize: 17,
    },

    content: {
        fontSize: 14,
        color: 'gray',
    },

    time: {
        color: 'gray',
        textAlign: 'right',
    },

    timeDetails: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
    },

    footerSpace: {
        height: 10,
    },
});
