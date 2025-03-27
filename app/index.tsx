import React from "react";
import {Dimensions, ImageSourcePropType, Platform, SafeAreaView, StyleSheet, View} from "react-native";
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";

const data: ImageSourcePropType[] = [
    require('../assets/images/unsplash1.jpg'),
    require('../assets/images/unsplash2.jpg'),
    require('../assets/images/unsplash3.jpg'),
    require('../assets/images/unsplash4.jpg'),
    require('../assets/images/unsplash5.jpg'),
]
const {width, height} = Dimensions.get("window");
console.log(Platform.OS, {width, height})
const _imageWidth = Math.min(width, height) * 0.8
const _imageHeight = _imageWidth * 1.3
const _spacing = (width - _imageWidth) / 2

function Home() {
    const scrollX = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler((e) => {
        scrollX.value = e.contentOffset.x / (_imageWidth + _spacing);
    })

    return (
        <SafeAreaView style={styles.container}>
            {data.map((item, i) => (
                <Background source={item} index={i} scrollX={scrollX}/>
            ))}

            <Animated.FlatList
                horizontal
                data={data}
                showsHorizontalScrollIndicator={false}
                style={{
                    flexGrow: 0,
                }}
                snapToInterval={_imageWidth + _spacing}
                decelerationRate={'fast'}
                contentContainerStyle={{
                    paddingHorizontal: _spacing,
                    gap: _spacing
                }}
                renderItem={({item, index}) =>
                    <Photo source={item} index={index} scrollX={scrollX}/>
                }
                onScroll={onScroll}
                scrollEventThrottle={1000 / 60}
            />

        </SafeAreaView>
    )
}

const Photo = ({source, index, scrollX}: {
    source: ImageSourcePropType,
    index: number,
    scrollX: SharedValue<number>
}) => {
    const style = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    scale: interpolate(scrollX.value, [index - 1, index, index + 1], [1.5, 1, 1.5]),
                }, {
                    rotate: `${interpolate(scrollX.value, [index - 1, index, index + 1], [15, 0, -15])}deg`
                }
            ]
        }
    })
    return (
        <View style={{
            width: _imageWidth,
            height: _imageHeight,
            overflow: 'hidden',
        }} key={index}>
            <Animated.Image source={source} style={[styles.image, style]}/>
        </View>
    )
}
const Background = ({source, index, scrollX}: {
    source: ImageSourcePropType,
    index: number,
    scrollX: SharedValue<number>,
}) => {
    const style = useAnimatedStyle(() => {
        return {
            opacity: interpolate(scrollX.value, [index - 1, index, index + 1], [0, 1, 0])
        }

    })
    return (
        <View style={[StyleSheet.absoluteFillObject]}>
            <Animated.Image
                source={source}
                style={[StyleSheet.absoluteFillObject, style]}
                resizeMode={"contain"}
                borderRadius={10}/>
        </View>
    )
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
        },
        image: {
            width: '100%',
            height: '100%',
        }
    });

export default Home;
