import Head from "next/head";
import Image from "next/image";
import Forcast from "../components/Forcast";
import styles from "../styles/Home.module.scss";

export default function Home() {
  return (
    <>
      {/* <Image
        src="/images/fall.jpg"
        alt="background"
        width={3822}
        height={1033}
      /> */}
      <div className={`${styles.background} ${styles.ss_clear}`}>
        <div className={styles.container}>
          <Forcast />
        </div>
      </div>

      {/* <Forcast /> */}
    </>
  );
}
