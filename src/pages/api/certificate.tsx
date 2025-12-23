import type { NextApiRequest, NextApiResponse } from "next";
import { Document, Page, Text, Image, Font, View, StyleSheet, renderToStream } from "@react-pdf/renderer";
import path from "path";

export const config = {
  api: {
    responseLimit: false,
  },
};

Font.register({
  family: "GreatVibes",
  src: path.join(
    process.cwd(),
    "public",
    "fonts",
    "GreatVibes-Regular.ttf"
  ),
});

const styles = StyleSheet.create({
  page: {
    width: 595,
    position: "relative",
  },

  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 595,
  },

  name: {
    position: "absolute",
    top: 360,
    left: 0,
    right: 0,
    textAlign: "center",
    fontWeight: "bold",
  },

  course: {
    position: "absolute",
    top: 410,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 27,
    fontWeight: "bold",
    color: "#e31c25",
  },

  certificateId: {
    position: "absolute",
    bottom: 120,
    left: 120,
    fontSize: 17,
  },

  date: {
    position: "absolute",
    bottom: 120,
    right: 120,
    fontSize: 17,
  },
  nameMain: {
    position: "absolute",
    bottom: 400,
    left: -190,
    fontFamily: "GreatVibes",
    fontSize: 60,
    extTransform: "capitalize",
  },
  courseMain: {
    position: "absolute",
    bottom: 310,
    left: -75,
  },
  certificateIdMain: {
    position: "absolute",
    bottom: 223,
    left: 170,
  },
  dateMain: {
    position: "absolute",
    bottom: 223,
    right: 65,
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

    const pdfDocument = (
  <Document>
    <Page size="A4">

      {/* BACKGROUND */}
      <Image
        src="https://backstagepass.co.in/bspLms/certificate-bg.png"
        style={styles.background}
        fixed
      />

      {/* TEXT */}
      <Text style={styles.nameMain}>
        <Text style={styles.name}>{studentName}</Text>
      </Text>
      <Text style={styles.courseMain}>
        <Text style={styles.course}>{courseName}</Text>
      </Text>
      
<Text style={styles.certificateIdMain}>
      <Text style={styles.certificateId}>
        {user_id}-{course_id}
      </Text>
</Text>
<Text style={styles.dateMain}>
      <Text style={styles.date}>
        {completionDate}
      </Text>
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
