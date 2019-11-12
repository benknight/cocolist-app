import cx from 'classnames';
import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link as TPLink, Wrap } from '@cocolist/thumbprint-react';
import { ContentActionsCheckSmall } from '@thumbtack/thumbprint-icons';
import Header from '../components/Header';
import { badges } from '../lib/Badges.common';

const urls = {
  dineGreen: 'http://www.dinegreen.com/certification-standards',
  foodies: 'https://www.facebook.com/groups/foodiesinsaigon/',
  rustyCompass:
    'https://www.rustycompass.com/vietnam-travel-guide-233/ho-chi-minh-city-4/eating-16/plastic-waste-saigon-restaurants-taking-action-to-reduce-plastic-waste-1319',
};

const ListItem = props => (
  <li className="flex mb1">
    <ContentActionsCheckSmall className="green mr2 flex-shrink-0" /> {props.children}
  </li>
);

const Footnote = props => (
  <TPLink to="#footnotes">
    <sup>[{props.index}]</sup>
  </TPLink>
);

const Text = ({ className, ...props }) => (
  <div className={cx(props.className, 'measure-wide mb3')} {...props} />
);

const About = ({ data, intl: { formatMessage }, location, pageContext: { langKey } }) => (
  <>
    <Helmet>
      <title>
        Cocolist {formatMessage({ id: 'Vietnam' })} &ndash;{' '}
        {formatMessage({
          id: 'header_link_about',
        })}
      </title>
    </Helmet>
    <Header location={location} />
    <Wrap>
      <article className="pb6">
        <header>
          <h1 className="tp-title-1 mt5 m_mt6 mb0">
            {langKey === 'vi' ? (
              <div>
                Giới thiệu về <span className="green">Cocolist</span>, ứng dụng tìm kiếm
                các doanh nghiệp có ý thức bảo vệ môi trường tại Việt Nam.
              </div>
            ) : (
              <div>
                Introducing <span className="green">Cocolist</span>, an app for finding{' '}
                <nobr>eco-conscious</nobr> businesses in Vietnam.
              </div>
            )}
          </h1>
        </header>
        <div className="w-100 m_w-33 mt4 ml3"></div>
        <section className="tp-body-1" id="introduction">
          <Text className="mt5">
            {langKey === 'vi' ? (
              <p>
                Xin chào! Tôi tên là Ben, đang sống tại Sài Gòn, một thành phố tràn trề
                nhiệt huyết nhưng đang phải đối mặt với một vấn nạn ngày càng đáng báo
                động: ô nhiễm. Trong lúc đang thực hiện các biện pháp tự giảm “dấu chân
                sinh thái” (eco-footprint) của mình, tôi chợt muốn làm thêm điều gì đó
                nhiều hơn thế.
              </p>
            ) : (
              <p>
                Xin chào! I’m Ben, and I live in Saigon, a vibrant city but with an
                increasingly alarming issue: <i>pollution</i>. While I have taken steps to
                reduce my own eco-footprint, I wanted to do more.
              </p>
            )}
          </Text>
          <Text>
            {langKey === 'vi' ? (
              <p>
                Sài Gòn có một cộng đồng doanh nghiệp địa phương đang phát triển mạnh mẽ,
                đồng thời người ta cũng đang dần nhận thức hơn các vần đề về môi trường.
                Ngày càng có nhiều người tiêu dùng ưu ái lựa chọn những doanh nghiệp có
                các biện pháp bảo vệ môi trường hoặc đưa ra cam kết giảm thiểu tác hại tới
                môi trường hơn.
              </p>
            ) : (
              <p>
                Saigon has a thriving local business community and at the same time people
                are becoming more aware about environmental issues. More consumers prefer
                to choose businesses that have taken steps be greener or shown a
                commitment to lessen their impact.
              </p>
            )}
          </Text>
          <Text>
            {langKey === 'vi' ? (
              <p>
                Và trên thực tế, đã có nhiều doanh nghiệp ở Sài Gòn đang thực hiện các
                biện pháp như giảm lượng sử dụng các sản-phẩm-dùng-một-lần bằng nhựa hoặc
                loại bỏ hoàn toàn những sản phẩm này, ngay cả khi điều này có thể gây ảnh
                hưởng tới lợi nhuận của họ.{' '}
                <em>
                  Những doanh nghiệp đó xứng đáng được khen thưởng cho những hành động tốt
                  đẹp của mình.
                </em>
              </p>
            ) : (
              <p>
                And in fact there are already lots of businesses in Saigon doing things
                like reducing single-use plastics or eliminating them entirely, even when
                it might hurt their bottom line.{' '}
                <em>These businesses deserve to be rewarded for their actions.</em>
              </p>
            )}
          </Text>
          <Text>
            {langKey === 'vi' ? (
              <p>
                Nhưng làm thế nào để những người tiêu dùng có-ý-thức-bảo-vệ-môi-trường có
                thể tìm thấy những doanh nghiệp cùng chí hướng? Cho tới bây giờ, cách duy
                nhất vẫn là kiểu “truyền miệng”, với các nhóm trên Facebook
                <Footnote index={1} /> <Footnote index={2} />, hoặc blog
                <Footnote index={3} />, nhưng hiện những cách này lại vấp phải một vấn đề
                nữa: chúng ta còn thiếu một danh sách độc lập và toàn diện liệt kê các
                doanh nghiệp như vậy.
              </p>
            ) : (
              <p>
                {' '}
                But how can eco-conscious consumers find eco-conscious businesses? Until
                now, the only way was through word-of-mouth, in Facebook groups
                <Footnote index={1} />
                <Footnote index={2} />, or blogs
                <Footnote index={3} />, but these still have one key problem: there is no
                independent, comprehensive list.
              </p>
            )}
          </Text>
          <Text>
            {langKey === 'vi' ? (
              <p>
                Đó là lý do chúng tôi tạo nên <b>Cocolist</b>, danh bạ đầu tiên tại Việt
                Nam cập nhật các doanh nghiệp có-ý-thức-bảo-vệ-môi-trường. Dự án bắt đầu
                từ ngành ẩm thực tại Sài Gòn, sau đó sẽ tiếp tục mở rộng đến các ngành
                khác như ngành dịch vụ khách hàng và ngành sức khỏe & làm đẹp, cũng như mở
                rộng ra phạm vi nhiều thành phố hơn như Đà Nẵng và Hà Nội trong các tháng
                tới. Bằng cách trao quyền lựa chọn cho người tiêu dùng, tôi hy vọng
                Cocolist sẽ truyền cảm hứng cho nhiều chủ doanh nghiệp hơn cùng bắt tay
                vào hành động.
              </p>
            ) : (
              <p>
                That’s why I created <b>Cocolist</b>, Vietnam's first up-to-date directory
                of eco-conscious businesses. Starting specifically with food & beverage
                businesses in Saigon, this project's goal is to eventually expand into
                more industries like hospitality and health & beauty, and more cities like
                Da Nang and Hanoi in the coming months. By giving consumers the power of
                choice, I hope Cocolist will inspire more business owners to take action.
              </p>
            )}
          </Text>
        </section>

        <section className="tp-body-1" id="recognition">
          <h2 className="tp-title-2 mt6 mb5">
            {langKey === 'vi' ? `Ứng dụng hoạt động như thế nào` : `How it works`}
          </h2>
          <h3 className="tp-title-4 mv3">
            {langKey === 'vi' ? `Chỉ công nhận tích cực` : `Positive recognition only`}
          </h3>
          <Text>
            {langKey === 'vi' ? (
              <p>
                Mỗi ngày ở Việt Nam, chỉ riêng ngành thực phẩm & thức uống đã tạo ra hàng
                triệu mảnh chất thải nhựa hoặc xốp loại sử dụng một lần. Một ly trà sữa
                trân châu hay cà phê có thể sử dụng tới 4 miếng nhựa riêng biệt: thân cốc,
                nắp, ống hút và túi đựng. Chính các chủ doanh nghiệp địa phương mới là
                người duy nhất có thể thay đổi “luật chơi” trong cuộc vận động này.
              </p>
            ) : (
              <p>
                Every day in Vietnam there are millions of pieces of single-use plastic or
                styrofoam waste generated in food & beverage industry alone. A single
                bubble tea or coffee can use up to 4 separate pieces of plastic: a cup,
                lid, straw and carrier. Local business owners are in a unique position to
                be game changers in this movement.
              </p>
            )}
          </Text>
          <Text>
            {langKey === 'vi' ? (
              <p>
                Đồng thời, thực tế là các chủ doanh nghiệp phải cân nhắc nhiều yếu tố như
                tỷ suất lợi nhuận, sự thuận tiện và độ tin cậy khi đưa ra quyết định có sử
                dụng bao bì thân thiện với môi trường hiện đang có sẵn trên thị trường hay
                không.
              </p>
            ) : (
              <p>
                At the same time, the reality is that business owners have to take many
                factors into consideration — e.g. profit margins, convenience, and
                reliability — when deciding whether or not to use the eco-friendly
                packaging that is currently available on the market.
              </p>
            )}
          </Text>
          <Text id="opensource">
            {langKey === 'vi' ? (
              <p>
                Do đó, mục tiêu của Cocolist là khuyến khích các hoạt động kinh doanh vì
                môi trường bằng cách{' '}
                <span className="underline">chỉ đưa ra sự công nhận tích cực</span>, và dữ
                liệu được thu thập phản ánh điều đó. Trong suốt quá trình, bất cứ khi nào
                doanh nghiệp có bước thực hiện khác, ứng dụng sẽ tính toán lại điểm số
                (xem bên dưới) và công bố.
              </p>
            ) : (
              <p>
                Therefore the goal of Cocolist is to incentivize green business practices
                by giving <u className="underline">positive recognition only</u>, and the
                data being collected reflects that. Along the way, any time a business
                takes another step, the app will recalculate its score (see below) and
                publish it.
              </p>
            )}
          </Text>
        </section>

        <section className="tp-body-1">
          <h3 className="tp-title-4 mt5 mb3">
            {langKey === 'vi' ? `Nguồn mở` : `Open source`}
          </h3>
          <Text>
            {langKey === 'vi' ? (
              <p>
                Chúng tôi tin rằng cách tốt nhất để khuyến khích nhiều người tham gia là
                càng minh bạch càng tốt. Đó là tại sao chúng tôi tạo ra bộ dữ liệu đầy đủ
                với website có nguồn mở và rộng cửa cho tất cả mọi người cùng đóng góp và
                phát triển nó. Ngoài ra, việc được lên danh sách của Cocolist là luôn luôn
                miễn phí. Chúng tôi không mong muốn thu lợi từ các chủ doanh nghiệp đã
                phải chi trả thêm chi phí để thay thế sử dụng nhựa.
              </p>
            ) : (
              <p>
                We believe that the best way to encourage participation is to be as
                transparent as possible. That's why we've made our full data set and
                website open source and open for anyone to contribute and improve. In
                addition, it will always be free for businesses to have a listing on
                Cocolist. We don't believe in profiting off business owners that are
                already footing the additional costs of replacing plastic.
              </p>
            )}
          </Text>
          <Text>
            {langKey === 'vi' ? (
              <p>
                Nếu bạn quan tâm đến việc đóng góp cho chúng tôi,{' '}
                <TPLink to="https://github.com/benknight/cocolist" shouldOpenInNewTab>
                  hãy tìm hiểu trên Github để biết thêm chi tiết nhé.
                </TPLink>
              </p>
            ) : (
              <p>
                If you're interested in contributing,{' '}
                <TPLink to="https://github.com/benknight/cocolist" shouldOpenInNewTab>
                  find more details on Github.
                </TPLink>
              </p>
            )}
          </Text>
        </section>

        <section className="tp-body-1" id="scoring">
          <h3 className="tp-title-4 mt5 mb3">
            {langKey === 'vi' ? `Chấm điểm doanh nghiệp` : `Business Scoring`}
          </h3>

          <Text>
            {langKey === 'vi' ? (
              <p>
                Đối với giai đoạn thu thập và nghiên cứu dữ liệu ban đầu, Cocolist sẽ sử
                dụng ‘Tiêu Chuẩn Chứng Nhận Nhà Hàng Xanh của Hiệp Hội Nhà Hàng Xanh’
                (Green Restaurant Association’s Green Restaurant Certification Standards)
                <Footnote index={4} /> làm hướng dẫn lựa chọn điểm dữ liệu nào cần thu
                thập và làm thế nào để đánh giá khả năng đóng góp vì môi trường của mỗi
                doanh nghiệp. Những khả năng này sau đó sẽ được phân nhóm vào các hạng mục
                với các “huy hiệu” tương ứng thể hiện trên hồ sơ của doanh nghiệp đó:
              </p>
            ) : (
              <p>
                For the initial data gathering and research phase, Cocolist is using the
                Green Restaurant Association’s Green Restaurant Certification Standards
                <Footnote index={4} /> as a guide for choosing what data points to collect
                and how to evaluate each business's environmental accomplishments. These
                accomplishments are then grouped into categories with a number of
                corresponding badges shown on the business's profile:
              </p>
            )}
          </Text>

          <div className="tp-body-2 pb6">
            <h4 className="tp-title-6 mt4 mb3">
              {langKey === 'vi' ? `Mang đi và giao hàng` : `Take-out & delivery`}
            </h4>
            <ul>
              <ListItem>
                {langKey === 'vi' ? (
                  `Giảm giá cho khách hàng khi tự đem theo hộp đựng cá nhân`
                ) : (
                  <span>
                    <span style={{ textIndent: '-0.3em' }}>
                      “Bring-your-own container”
                    </span>{' '}
                    discount
                  </span>
                )}
              </ListItem>
              <ListItem>
                {langKey === 'vi'
                  ? `Giao hàng không sử dụng sản phẩm làm từ nhựa`
                  : `Plastic-free delivery available`}
              </ListItem>
              <ListItem>
                {langKey === 'vi'
                  ? `Giảm thiểu/Loại bỏ sử dụng đồ-dùng-một-lần bằng nhựa`
                  : `Single-use plastics reduced or eliminated`}
              </ListItem>
            </ul>
            <h4 className="tp-title-6 mt4 mb3">
              {langKey === 'vi' ? `Ăn tại chỗ` : `Dine-in`}
            </h4>
            <ul>
              <ListItem>
                {langKey === 'vi'
                  ? `Giảm thiểu/Loại bỏ sử dụng đồ-dùng-một-lần bằng nhựa`
                  : `Single-use plastics reduced or eliminated`}
              </ListItem>
              <ListItem>
                {langKey === 'vi'
                  ? `Tái sử dụng khăn ăn, khăn lau, khăn trải, ống hút v.v.`
                  : `Reusable napkins, towels, linens, straws, etc.`}
              </ListItem>
              <ListItem>
                {langKey === 'vi'
                  ? `Nước uống được châm thêm miễn phí `
                  : `Free, refillable water provided`}
              </ListItem>
            </ul>
            <h4 className="tp-title-6 mt4 mb3">
              {langKey === 'vi' ? `Phòng bếp` : `Kitchen`}
            </h4>
            <ul>
              <ListItem>
                {langKey === 'vi'
                  ? `Tái chế và phân loại rác đúng cách`
                  : `Proper recycling & waste separation`}
              </ListItem>
              <ListItem>
                {langKey === 'vi' ? `Xử lý thức ăn thừa` : `Food waste management`}
              </ListItem>
              <ListItem>
                {langKey === 'vi'
                  ? `Dùng bể tách mỡ cho bồn rửa `
                  : `Grease traps on sinks`}
              </ListItem>
              <ListItem>
                {langKey === 'vi'
                  ? `Sản phẩm tẩy rửa thân thiện với môi trường `
                  : `Green cleaning products`}
              </ListItem>
            </ul>
            <h4 className="tp-title-6 mt4 mb3">
              {langKey === 'vi' ? `Thực đơn` : `Menu`}
            </h4>
            <ul>
              <ListItem>
                {langKey === 'vi' ? `Nguyên liệu địa phương` : `Local ingredients`}
              </ListItem>
              <ListItem>
                {langKey === 'vi' ? `Có thêm món chay ` : `Plant-based options`}
              </ListItem>
              <ListItem>
                {langKey === 'vi' ? `Thực đơn thuần chay` : `Vegetarian`}
              </ListItem>
              <ListItem>
                {langKey === 'vi' ? `Thủy sản bền vững` : `Sustainable seafood`}
              </ListItem>
            </ul>
          </div>

          <h3 className="tp-title-4 mb6" id="badges">
            {langKey === 'vi' ? `Các huy hiệu` : `Badges`}
          </h3>

          <div className="s_flex flex-wrap mv5">
            {badges.map(badge => (
              <div
                className="flex items-center s_flex-column s_items-start s_w-50 m_w-33 pb6 pr4 l_pr6"
                key={badge.title}>
                <img
                  alt=""
                  className="s_mb4 mr4 s_mr0"
                  src={require(`../assets/badges/${badge.imageLarge}`)}
                />
                <div>
                  <h4 className="tp-title-5 mb2">
                    <FormattedMessage id={badge.title} />
                  </h4>
                  <div className="tp-body-2 measure-narrow">
                    <FormattedMessage
                      id={badge.description}
                      values={{
                        business: formatMessage({ id: 'generic_business_name' }),
                        byoc_percent: '',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="tp-body-3" id="footnotes">
          <ul className="mt7">
            <li>
              [1]{' '}
              <TPLink to="https://www.facebook.com/groups/expatshcmc/" shouldOpenInNewTab>
                “Expats in HCMC”
              </TPLink>
              . Facebook.
            </li>
            <li>
              [2]{' '}
              <TPLink to={urls.foodies} shouldOpenInNewTab>
                “Foodies in Saigon”
              </TPLink>
              . Facebook.
            </li>
            <li>
              [3]{' '}
              <TPLink to={urls.rustyCompass} shouldOpenInNewTab>
                “Saigon restaurants taking action to reduce plastic waste”
              </TPLink>
              . Rusty Compass.
            </li>
            <li>
              [4]{' '}
              <TPLink to={urls.dineGreen} shouldOpenInNewTab>
                “Green Restaurant Certification Standards”
              </TPLink>
              . Green Restaurant Association
            </li>
          </ul>
        </section>

        <section id="contact">
          <p className="mt5 mb0 b tp-body-3">
            Inquiries
            <br />
            <a className="link" href="mailto:xinchao@cocolist.vn">
              xinchao@cocolist.vn
            </a>
          </p>
        </section>
      </article>
    </Wrap>
  </>
);

export default injectIntl(About);
