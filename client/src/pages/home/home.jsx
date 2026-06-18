import Navbar from '../../components/navbar/Navbar'
import Hero from '../../components/hero/hero'
import Footer from '../../components/footer/Footer'

export default function Home() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            <Navbar />
            <Hero />
            <Footer />

        </div>
    )
}