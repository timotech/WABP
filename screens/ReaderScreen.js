import * as React from "react";

import { SafeAreaView, useWindowDimensions } from "react-native";
import { Reader, ReaderProvider } from "epubjs-react-native";

export default function ReaderScreen() {
  const { width, height } = useWindowDimensions();
  return (
    <SafeAreaView>
      <ReaderProvider>
        <Reader
          src={{ uri: "https://s3.amazonaws.com/moby-dick/OPS/package.opf" }}
          width={width}
          height={height}
          onDisplayError={(err) => {
            alert("Error displaying book: " + err);
          }}
        />
      </ReaderProvider>
    </SafeAreaView>
  );
}
