import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  Link,
  Font,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
  usePDF,
  BlobProvider,
} from "@react-pdf/renderer";

const Invoice = (orderDetails, store) => {
  Font.register({
    family: "Lato",
    src: `https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf`,
  });

  Font.register({
    family: "Lato Bold",
    src: `https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf`,
  });

  const styles = StyleSheet.create({
    container: {
      paddingTop: 60,
      paddingBottom: 60,
      paddingLeft: 40,
      paddingRight: 40,

      //   borderBottomWidth: 2,
      //   borderBottomColor: '#112131',
      //   borderBottomStyle: 'solid',
      //   alignItems: 'stretch',
    },

    infoContainer: {
      paddingTop: 50,
      paddingBottom: 50,
    },

    invoiceContainer: {
      paddingBottom: 25,
      borderBottomWidth: 1,
      borderBottomColor: "#112131",
      borderBottomStyle: "solid",
      marginBottom: 20,
    },

    totalContainer: {
      paddingTop: 100,
      paddingBottom: 100,
      paddingRight: 50,
      flexDirection: "row",
      justifyContent: "flex-end",
      // backgroundColor: 'red',
    },

    totalContent: {
      // backgroundColor: 'blue',
      width: "40%",
      flexDirection: "column",
      // justifyContent : "column",
    },

    totalText: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    text: {
      fontSize: 10,
      paddingTop: 2,
      paddingBottom: 2,
      fontFamily: "Lato",
    },

    textBold: {
      fontSize: 12,
      fontFamily: "Lato Bold",
    },

    rowTable: {
      paddingTop: 5,
      paddingBottom: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },

    row1: {
      width: "27%",
    },
    row2: {
      width: "26%",
    },
    row3: {
      width: "10%",
    },
    row4: {
      width: "18%",
    },
    row5: {
      width: "19%",
    },

    title: {
      fontSize: 32,
      textAlign: "center",
    },

    link: {
      fontFamily: "Lato",
      fontSize: 12,
      color: "blue",
      textDecoration: "underline",
      marginTop : 10,
      //   alignSelf: "flex-end",
      //   justifySelf: "flex-end",
    },
  });

  let orderList = orderDetails.order.orderItems.map((item) => {
    return (
      //   <View key={item.index}>
      <>
        <Text style={[styles.row1, styles.text]}>{item.name}</Text>
        <Text style={[styles.row2, styles.text]}>{item._id}</Text>
        <Text style={[styles.row3, styles.text]}>{item.Qty}</Text>
        <Text style={[styles.row4, styles.text]}>{item.price}</Text>
        <Text style={[styles.row5, styles.text]}>
          {Math.round(item.price * item.Qty * 100) / 100}
        </Text>
      </>
      // <Text>
      //   {item.name} || {item.price} x {item.Qty} || {item.price * item.Qty}
      // </Text>

      //   </View>
    );
  });

  const openFileInNewTab = (blob) => {
    const url = URL.createObjectURL(blob);
    // window.open(url, "_blank");
    setTimeout(() => {
      window.open(url, '_blank');
    })
  };

  const MyDocument = () => {
    return (
      <Document>
        <Page size="A3">
          <View style={styles.container}>
            <Text style={styles.title}>{store.name}</Text>

            <View style={styles.infoContainer}>
              <Text style={styles.text}>{store.name} service clients</Text>
              <Text style={styles.text}>contact@pikkopay.fr</Text>
              <Text style={styles.text}>www.pikkopay.fr</Text>
              {/* <Text style={styles.text}>{orderDetails.order.paidAt}</Text> */}
            </View>

            <View style={styles.invoiceContainer}>
              <Text style={styles.textBold}>
                Num. commande: &nbsp; {orderDetails.order._id}
              </Text>
              <Text style={styles.textBold}>
                Date de facture: &nbsp;{" "}
                {orderDetails.order.updatedAt.substring(8, 10)}/
                {orderDetails.order.updatedAt.substring(5, 7)}/
                {orderDetails.order.updatedAt.substring(0, 4)}
              </Text>
            </View>

            <View style={styles.rowTable}>
              <Text style={[styles.row1, styles.textBold]}>Désignation</Text>
              <Text style={[styles.row2, styles.textBold]}>Article</Text>
              <Text style={[styles.row3, styles.textBold]}>Quantité</Text>
              <Text style={[styles.row4, styles.textBold]}>Prix unitaire</Text>

              <Text style={[styles.row5, styles.textBold]}>Total</Text>
            </View>

            <View style={styles.rowTable}>{orderList}</View>

            <View style={styles.totalContainer}>
              <View style={styles.totalContent}>
                <View style={styles.totalText}>
                  <Text style={styles.textBold}> Total à régler </Text>
                  <Text style={styles.text}>
                    {" "}
                    {orderDetails.order.itemsPrice}{" "}
                  </Text>
                </View>

                <View style={styles.totalText}>
                  <Text style={styles.textBold}> Mode de paiement </Text>
                  <Text style={styles.text}> CB </Text>
                </View>

                <View>
                  <Link
                    src={localStorage.getItem("receipt_url")}
                    target="_blank"
                  >
                    <Text style={styles.link}>Lien reçu CB</Text>
                  </Link>
                </View>
              </View>
            </View>

            {/* <View>
              <Text>
                {orderDetails.order.orderItems
                  .map((product) => product.Qty)
                  .reduce((a, b) => a + b)}{" "}
                articles
              </Text>
            </View> */}

            <View>
              {/* <Text>
                        <>
                        {localStorage.getItem('receipt_url') ? (
                            <>
                            <a href='https://www.google.com'>RECEIPT URL</a>                         
                            </>
                        ) : (
                            <></>
                        )}
                        </>
                    </Text> */}
            </View>

            {/* <Link>Click me to get to the footnote</Link>
            <Text style={{ fontSize: "5px" }}>
              {localStorage.getItem("receipt_url")}
            </Text> */}
          </View>
        </Page>
      </Document>
    );
  };

  return (
    <>
      {/* {pdf ? ( */}

      {/* <PDFDownloadLink document={<MyDocument />} target="_blank" fileName="invoice.pdf">
        {({ blob, url, loading, error }) =>
          loading ? (
            "Loading..."
          ) : (
            <div className="">
              <img src="/images/download.png" alt="validé" className="" />
            </div>
          )
        }
      </PDFDownloadLink> */}
      <BlobProvider document={<MyDocument />} fileName="invoice.pdf">
        {({ blob, url, loading, error }) =>
          loading ? (
            "Loading..."
          ) : (

            <div className="">
              <button className="border-none" onClick={() =>openFileInNewTab(blob)}>
              <img src="/images/download.png" alt="validé" className="" />
              </button>
            </div>
          )
        }
      </BlobProvider>

      {/* ) : (
                <div>Loading...</div>
            )} */}
    </>
  );
};

export default Invoice;
