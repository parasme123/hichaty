import React from 'react';
import {Container} from 'native-base';
import {StyleSheet, View, Text, ScrollView,TouchableOpacity, SafeAreaView} from 'react-native';
import Header from '../components/header';
import { backblue } from '../assets/changethemeicons';
import { SvgXml } from 'react-native-svg';
const PrivacyPolicy = (props) => {
  const {navigation} = props;
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#ffffff'}}>

    <Container style={styles.container}>
       <View style={styles.icons}>
        <TouchableOpacity style={{ padding: 8, }} onPress={() => navigation.goBack()}>
          <SvgXml
            xml={backblue}
          />
        </TouchableOpacity>

        <Text style={[styles.inputfield, { marginLeft: 5 }]}>Privacy Policy</Text>

      </View>
      {/* <Header comment="Terms & Conditions" back={() => navigation.goBack()} /> */}
      {/* <ScrollView showsVerticalScrollIndicator="false"> */}
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>1. Introduction</Text>
          <Text style={styles.text}>PRIVACY POLICY & USER AGREEMENT
The HiChaty respects the privacy of visitors to its website and application, member companies and other HiChaty users. This Privacy Policy explains what personal information we collect from these users and how we use, disclose, and protect it. Most personal information we obtain is provided voluntarily by the data subject in conjunction with our Association’s activities: we put on events, transmit publications, and facilitate member discussions and networking, protect our members’ intellectual property, and engage in advocacy for the technology and content industries.

Please read this policy thoroughly to ensure that you understand the circumstances under which HiChaty collects and uses information and when HiChaty may disclose such information to third parties.

COLLECTION OF INFORMATION
Information Collected from Users of the HiChaty Website. Users to the public areas of HiChaty website generally browse anonymously. We do not normally attempt to identify website visitors without a security-related reason. HiChaty uses a third-party service to collect, and report aggregate and anonymized data, such as number of people you talked with and other related measures. HiChaty collects the IP address of those who report piracy to HiChaty on the site to help HiChaty staff judge the reliability of the report.

Information Collected from HiChaty Members, and Users. HiChaty asks some users to voluntarily provide some limited information, such as name, mobile number, and email. Whenever we transfer your personal information to a third party, we have contract clauses that provide for appropriate security to protect your privacy.

USE AND DISCLOSURE OF INFORMATION
Use of Data Collected from Users of the HiChaty Application. We use data collected about users of the HiChaty Application only for internal and marketing purposes. We do not retain any personally identifying information. On occasion, HiChaty make chat rooms, forums, message boards, and news groups available. Any information that users voluntarily disclose in these areas may be publicly accessible. HiChaty does not routinely monitor these activities and users should exercise caution when sharing personal information.

Use of Information Collected from HiChaty Members, and Other Users. HiChaty uses the data it collects from HiChaty members, newsletter subscribers, and other customers to perform activities related to: (i) identifying HiChaty members and administering user accounts;(ii) developing and improving the services offered by HiChaty; and (iii) contacting members and other customers with information about HiChaty services, promotions or special offers, unless they have indicated that they do not want to be contacted. Anyone may choose to withdraw their consent by following the procedure within the footer of any HiChaty email communications. Alternatively, anyone may email support@hichaty.com with a request to withdraw consent from all or any specific HiChaty communications.

Disclosure of Information to Third Parties. HiChaty makes member company features information and contact information available to certain users of the HiChaty website and to those who register for HiChaty Application. HiChaty may also share data with event sponsors who may want to send HiChaty information about their New Features. HiChaty requires these third parties to maintain, use, and disclose any information provided by HiChaty in a manner consistent with this policy.

Disclosure to HiChaty Contractors. HiChaty employs contractors to assist with administrative and other de rigueur functions and may provide contractors with access to data. Contractors include lawyers, auditors, and other service providers. So long as we have your information, you cannot withdraw consent for disclosures to HiChaty contractors. HiChaty requires its contractors who have access to maintain appropriate security and to maintain, use, and disclose any personal information provided by HiChaty in a manner consistent with this policy.

Individuals May Withdraw Consent at Any Time: Individuals may request HiChaty to stop third party disclosures by indicating their preferences on their HiChaty member account profile or when registering for an HiChaty service or other instance in which they are providing contact information to HiChaty. At any other time, individuals who do not want HiChaty to share their contact information with third parties should log into their account profile to indicate their preferences. If you want to delete your information from our databases, contact HiChaty directly at support@hichaty.com To request that their information be deleted.

Reporting Piracy to HiChaty. Anyone can voluntarily report possible incidents of software piracy and content piracy to HiChaty through HiChaty’s online piracy reporting forms, email or hotline. HiChaty uses this information to investigate piracy claims and, if necessary, to take legal and/or other enforcement action. All information identifying individuals who report software piracy or content piracy is kept strictly confidential by HiChaty staff and outside counsel and is not disclosed unless required by law or expressly allowed by the individual who reported the piracy.

Other Disclosures. HiChaty does not generally disclose personal information except as described here. However, in response to legal process, or in the event that we believe that our website has been hacked or we find evidence suggesting improper or criminal activity, we reserve the right to share information with law enforcement and others to protect our rights and property. We may also make disclosures to take precautions against liability or to provide information to law enforcement agencies or for an investigation on a matter related to public safety.

Business transfers. If we sell the business, we will require that the purchaser will abide by this privacy policy, either now or as it may be amended from time to time. We reserve the right to transfer your personal information if we are bought by another firm. Information that we acquire from a purchased business will be treated in accordance with this privacy policy.

SECURITY AND COMPLIANCE
HiChaty stores all information it collects on servers accessible only by HiChaty employees and contractors. We use reasonable and current security methods to prevent unauthorized access, unauthorized disclosure, loss, and destruction; maintain data accuracy; and ensure correct use of information. Account information and profiles are password protected. We recommend that HiChaty members and any others with password-protected access to the HiChaty website not divulge their password to anyone and take adequate precautions to ensure that their password is not accessible to third parties. Although we try to protect any information transmitted to us, no system is invulnerable. When HiChaty employs contractors that may have access to personal information, we require that they maintain, use, and disclose any information provided by HiChaty in a manner consistent with this policy. HiChaty is committed to making sure that its privacy policy is understood and respected by all of its employees. All HiChaty employees who collect, access or disclose information about members and customers are informed of this policy to ensure that they understand the importance of privacy and how our policy affects an individual's job responsibilities.

DATA QUALITY AND ACCESS
Any individual who submits information to HiChaty may review the information and ask us to correct, amend or delete it. You are ultimately responsible for the accuracy of the information you submit. If you provide us with a business address, we rely on that information to determine your country of residence. If you would like us to delete your personal information, or for other privacy questions, please contact support@hichaty.com

MISCELLANEOUS
External Links. HiChaty website provides links to other websites that HiChaty does not control. Each of these sites maintains its own independent privacy and data collection practices and procedures. Users who visit a website that is linked to our site should consult that site's privacy policy.

Children. HiChaty does not knowingly market its goods or services to, or collect data from, or otherwise target minors.

ASSENT AND MODIFICATIONS TO PRIVACY POLICY
Use of this website signifies agreement to the terms of HiChaty’s privacy policy. Any user who does not agree with these terms, should navigate away from the site and not disclose any information through this site. HiChaty may modify this privacy policy at any time at its discretion and modifications are effective upon being posted on this site. If we make material changes to this privacy policy and we have your contact information, we will notify you if feasible and obtain your consent to those changes when the law requires us to do so. If you provide us with an email address that no longer works and we notify you about changes to this policy, you agree that we have notified you. Users should review this privacy policy periodically to ensure that they are aware of any changes to it. Upon request, HiChaty will also attempt to notify existing HiChaty members and other existing HiChaty customers of material changes to this privacy policy.

CONCERNS OR COMPLAINTS
Anyone who believes that HiChaty has not adhered to its privacy policy or is otherwise concerned about the treatment of their data should contact support@hichaty.com.

USAGE AGREEMENT
This website, its fora, and its interactive tools (collectively, the "Site") are provided by HiChaty ("US"), to you ("you" or "user"), subject to the terms of this online agreement ("Agreement"), and the rules that may be published from time to time by HiChaty. The Site is provided to users who agree to abide by the terms and conditions of this Agreement. HiChaty reserves the right to change the nature of this relationship at any time. Users who violate the terms of this Agreement may be permanently banned from using this service. USAGE OF THE SITE WILL CONSTITUTE ACCEPTANCE OF THE TERMS AND CONDITIONS OF THIS AGREEMENT. IF YOU DO NOT AGREE TO ABIDE BY THESE TERMS, YOU MAY NOT ENTER OR USE THE SITE.

Users of this Site should be aware that content on the Site is protected by Indian Copyright laws. It is not intended for public distribution or copying, absent the express permission of the author. You agree that you will not copy, download, rent, lease, sell, distribute, transmit, or otherwise transfer all or any portions of the content related to the Site or otherwise take any other action in violation of HiChaty’s or any user's copyright OTHER THAN THOSE EXPRESSLY AUTHORIZED BY THE USER AND HiChaty, including, but not limited to, copy, use or transmission of data for solicitation and /or commercial purposes.

If you have a concern about copyrighted material hosted on this website, or in an HiChaty forum, please email at support@hichaty.com HiChaty will terminate the accounts of any HiChaty service that repeatedly infringes copyright.

The views and information expressed by users of this Site are strictly those of the users and are not necessarily endorsed by HiChaty. HiChaty makes no warranty as to the accuracy or reliability of any views or information expressed on this Site. By using the Site, you agree that you alone are responsible for the content of your postings, and that HiChaty will not be held legally responsible for the content posted by you or any other user. Any disputes with respect to such material shall be handled strictly by or between the Site's users and shall not involve HiChaty. Any user posting any message on the Site agrees to defend and indemnify HiChaty against any and all legal claims brought as a result of that message, including without limitation claims based on privacy, publicity, defamation, intellectual property, fraud, and all other legal claims.

I HAVE READ AND UNDERSTAND THE FOREGOING AGREEMENT AND AGREE TO BE BOUND BY ALL OF ITS TERMS.</Text>
        </ScrollView>
      </View>
      {/* </ScrollView> */}
    </Container>
    </SafeAreaView>

  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  content: {
    width: '93%',
    alignContent: 'center',
    alignSelf: 'center',
    // alignItems:'center',
    // marginTop: '35%',
  },
  icons: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '100',
    marginTop: 5,
    marginBottom: 90,
    color: '#000000aa',
    // marginLeft:3
  },
});
