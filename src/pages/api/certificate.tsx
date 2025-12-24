import type { NextApiRequest, NextApiResponse } from "next";
import { Document, Page, Text, Image, Font, View, StyleSheet, renderToStream } from "@react-pdf/renderer";
import path from "path";

export const config = {
  api: {
    responseLimit: false,
  },
};

Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: path.join(process.cwd(), "public/fonts/Montserrat-Bold.ttf"),
      fontWeight: "bold",
    },
    {
      src: path.join(process.cwd(), "public/fonts/Montserrat-SemiBold.ttf"),
      fontWeight: "semibold",
    },
  ],
});

Font.register({
  family: "Bellarina",
  src: path.join(
    process.cwd(),
    "public",
    "fonts",
    "Bellarina.otf"
  ),
});
Font.registerHyphenationCallback(word => [word]);

const styles = StyleSheet.create({
  page: {
    width: 595,
    height: 842,
    position: "relative",
  },

  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 595,
    height: 842,
  },

  studentName: {
    position: "absolute",
    top: 385,
    left: 40,
    textAlign: "center",
    fontFamily: "Bellarina",
    fontSize: 50,
    textTransform: "capitalize",
  },

  courseName: {
    position: "absolute",
    top: 500,
    left: 40,
    width: 435,     
    textAlign: "left",
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Montserrat",
    color: "#e31c25",
  },

  certificateId: {
    position: "absolute",
    bottom: 217,
    left: 168,
    fontFamily: "Montserrat",
    fontWeight: "semibold",
    fontSize: 14,
  },

  date: {
    position: "absolute",
    bottom: 217,
    fontFamily: "Montserrat",
    fontWeight: "semibold",
    right: 70,
    fontSize: 14,
  },
});





export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { user_id, course_id } = req.query;

    if (!user_id || !course_id) {
      return res
        .status(400)
        .json({ error: "user_id and course_id are required" });
    }

    const apiUrl = `https://backstagepass.co.in/reactapi/getcertificatedata.php?user_id=${user_id}&course_id=${course_id}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch certificate data");
    }

    const data = await response.json();

    const studentName = data?.student_name ?? "Unknown Student";
    const courseName = data?.course_name ?? "Unknown Course";
    const completionDate = data?.completion_date ?? "Unknown Date";
    const certificateautoid = data?.certificate_auto_id ?? "Unknown Date";
    

    const pdfDocument = (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* Background */}
      <Image
        src="https://backstagepass.co.in/bspLms/certificate-bg.png"
        style={styles.background}
        fixed
      />

      {/* Student Name */}
      <Text style={styles.studentName}>
        {studentName}
      </Text>

      {/* Course Name */}
      <Text style={styles.courseName}>
        {courseName}
      </Text>

      {/* Certificate ID */}
      <Text style={styles.certificateId}>
        {certificateautoid}
      </Text>

      {/* Completion Date */}
      <Text style={styles.date}>
        {completionDate}
      </Text>

    </Page>
  </Document>
);




    const stream = await renderToStream(pdfDocument);
    const chunks: Uint8Array[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const pdfBuffer = Buffer.concat(chunks);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=certificate.pdf"
    );

    res.status(200).send(pdfBuffer);
  } catch (error: unknown) {
    res.status(500).json({
      error: "PDF generation failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
