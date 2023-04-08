import { useRouter } from 'next/router'
import React from 'react'

type Props = {}

const Profile: React.FC<Props> = (props) => {
  const router = useRouter()
  console.log(router.query)
  return (
    <>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempora porro facere, molestiae
        modi fugit fuga magni temporibus incidunt corrupti, maxime itaque pariatur! Omnis ipsam
        praesentium eligendi, magni vitae consequuntur soluta temporibus quia unde molestias, nemo
        accusamus doloribus veniam, quos non quod. Alias, fuga. Quisquam, voluptatem. Perspiciatis
        modi impedit error cupiditate magnam commodi ipsum accusamus nobis esse expedita cum
        voluptatum optio earum eum, deleniti placeat non pariatur odit provident! Sequi illum saepe
        iste id vero tenetur, eveniet consequatur totam architecto pariatur laboriosam earum!
        Exercitationem quaerat deserunt voluptatibus nam eveniet labore consectetur. Minima sunt at,
        deserunt modi quod fugiat cumque ipsum. Amet porro iste vel non, sapiente nemo. Id quia
        nostrum velit fugit rerum sapiente maiores cumque, perspiciatis minima accusamus, voluptatum
        non aut aperiam assumenda et repellendus numquam temporibus maxime culpa esse vero sint
        obcaecati! Ipsa esse quasi est id, impedit fugiat maxime ullam architecto voluptatum magni
        consectetur temporibus. Minus, saepe excepturi id itaque laboriosam totam! Ducimus harum aut
        ipsa, quaerat ut praesentium maiores consectetur nulla, autem unde numquam itaque quod dicta
        quam natus molestias assumenda perspiciatis pariatur quidem iusto repellendus consequuntur.
        Repellat placeat earum quasi et voluptatibus ea, ab praesentium quod accusamus cupiditate
        doloremque omnis soluta architecto doloribus sed natus aut autem quibusdam perferendis
        nesciunt id impedit. Tenetur, fugit laborum officia impedit animi delectus a numquam
        inventore, sed accusantium, odit consectetur tempora illum quia tempore? Ex, atque id
        fugiat, cum debitis assumenda ducimus, doloremque nesciunt similique quaerat illum quae
        molestias. Libero, inventore incidunt perferendis quaerat quasi voluptas est quas. Neque
        eveniet numquam nulla est rerum nemo quo, corporis minima sapiente cumque cum dicta
        asperiores illo repudiandae odio explicabo? Quisquam magnam illum doloremque voluptatum
        itaque amet accusantium officiis qui, eius magni? Consectetur tenetur vitae at, architecto
        illo quibusdam officia cumque libero odio nobis dolor pariatur incidunt laboriosam
        excepturi, dolorum vel repudiandae! Earum culpa debitis vel accusamus ratione asperiores
        cumque corporis officia quia ut impedit tempora omnis eveniet totam ea expedita quod ipsam,
        sunt deleniti doloribus? Voluptatibus repellendus voluptates laudantium itaque. Consequuntur
        magni ipsum nihil est pariatur obcaecati consequatur! Aut quisquam maxime sint cum
        distinctio ad fugit ea magnam, odit placeat et ex rem earum explicabo error exercitationem.
        Incidunt, nulla! Nobis aliquid, a quod sit illum eius aut alias ad fugiat fuga dignissimos
        saepe? Iusto porro earum quam illo alias soluta eum itaque laborum reiciendis ad maiores
        dicta harum dolorem eos doloribus aliquid fugit repellendus iure sapiente numquam facere,
        autem ipsum recusandae nobis! Nam hic alias cumque reprehenderit odit accusamus iste, quo
        officia neque dolor? Maiores delectus aperiam esse architecto non, nihil ea nisi, alias
        porro sint optio facilis tempora possimus mollitia, velit quam. Dicta eum beatae
        necessitatibus quisquam quidem tempora sapiente sequi quaerat nulla non assumenda, deserunt,
        obcaecati reiciendis ipsum sit, nisi dolor eveniet rem reprehenderit fugiat earum? Quisquam,
        explicabo. Quidem repellat voluptas consequatur excepturi natus repellendus quod facere
        consectetur earum porro! Soluta corrupti in totam nobis ducimus reiciendis temporibus quas
        impedit ipsam, inventore minus fugiat quaerat ipsum dolore! Facilis, voluptates? Laboriosam
        error obcaecati quasi animi porro hic molestiae veritatis rem dolorum!
      </p>
      <br />
      {router.query['profile-url']}
    </>
  )
}

export default Profile
