import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HomeHero } from '@/components/sections/HomeHero';
import { HomeTrailer } from '@/components/sections/HomeTrailer';
import { HomeAbout } from '@/components/sections/HomeAbout';
import { HomeDeveloper } from '@/components/sections/HomeDeveloper';
import { HomeMerchandise } from '@/components/sections/HomeMerchandise';
import { HomeNews } from '@/components/sections/HomeNews';
import { HomeComments } from '@/components/sections/HomeComments';

export default function Home() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main>
        <HomeHero
          buttonUrl="https://ikmalionn.itch.io/the-golden-curse-of-keong-mas"
          buttonText="GET THE GAME"
        />
        <HomeTrailer />
        <HomeAbout />
        <HomeDeveloper />
        <HomeMerchandise />
        <HomeNews />
        <HomeComments />
      </main>
      <Footer />
    </div>
  );
}
