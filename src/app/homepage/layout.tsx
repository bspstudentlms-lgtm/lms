import "@/assets/bootstrap/css/bootstrap.min.css";
// import "@/assets/fonts/font-awesome.min.css";
// import "@/assets/fonts/themify-icons.css";
import "@/assets/owlcarousel/css/owl.carousel.css";
import "@/assets/owlcarousel/css/owl.theme.css";
import "@/assets/css/slicknav.css";
import "@/assets/css/magnific-popup.css";
import "@/assets/css/animate.css";
import "@/assets/css/style.css";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/themify-icons/1.0.1/css/themify-icons.css"
      />
      {children}
    </>
  );
}

