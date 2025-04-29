//
//  fetch-reviews.swift  — v1.1  (fixes 401)
//
import Foundation
import CryptoKit

// MARK: – small helpers -------------------------------------------------------

enum FetchError: Error { case env(String), jwt(String), network(Int, String) }

func b64url<T: DataProtocol>(_ d: T) -> String {
    Data(d).base64EncodedString()
        .replacingOccurrences(of: "+", with: "-")
        .replacingOccurrences(of: "/", with: "_")
        .replacingOccurrences(of: "=", with: "")
}

// MARK: – JWT -----------------------------------------------------------------

func makeJWT(keyID: String, issuerID: String, pem: String) throws -> String {
    let header = #"{"alg":"ES256","kid":"\#(keyID)","typ":"JWT"}"#
    let now    = Int(Date().timeIntervalSince1970)
    let payload = #"{"iss":"\#(issuerID)","iat":\#(now),"exp":\#(now+1200),"aud":"appstoreconnect-v1"}"#

    let headPayload = "\(b64url(Data(header.utf8))).\(b64url(Data(payload.utf8)))"

    let key = try P256.Signing.PrivateKey(pemRepresentation: pem)
    let sig = try key.signature(for: Data(headPayload.utf8))

    return "\(headPayload).\(b64url(sig.rawRepresentation))"
}


// MARK: – CLI / env -----------------------------------------------------------

let cli = Array(CommandLine.arguments.dropFirst())
func arg(_ i: Int, _ env: String) -> String? { cli.indices.contains(i) ? cli[i] : ProcessInfo.processInfo.environment[env] }

guard
  let appID   = arg(0,"ASC_APP_ID"),
  let keyPath = arg(1,"ASC_PRIVATE_KEY_PATH"),
  let keyID   = arg(2,"ASC_KEY_ID"),
  let issID   = arg(3,"ASC_ISSUER_ID")
else { throw FetchError.env("Missing positional args or env vars.") }

let outFile = arg(4,"ASC_OUTPUT_FILE") ?? "reviews.json"
let pem     = try String(contentsOfFile: keyPath, encoding: .utf8)

let jwt = try makeJWT(keyID: keyID, issuerID: issID, pem: pem)

// MARK: – Fetch loop ----------------------------------------------------------

var url = URL(string: "https://api.appstoreconnect.apple.com/v1/apps/\(appID)/customerReviews?limit=200")!
var reviews: [[String:Any]] = []
let session = URLSession(configuration: .ephemeral)

while true {
    var req = URLRequest(url: url)
    req.addValue("Bearer \(jwt)", forHTTPHeaderField: "Authorization")

    let (data, resp) = try await session.data(for: req)
    guard let http = resp as? HTTPURLResponse else { throw FetchError.network(-1,"no response") }

    guard (200..<300).contains(http.statusCode) else {
        let msg = (try? JSONSerialization.jsonObject(with: data) as? [String:Any])?["errors"]
        throw FetchError.network(http.statusCode, String(describing: msg))
    }

    let obj = try JSONSerialization.jsonObject(with: data) as! [String:Any]
    reviews += (obj["data"] as? [[String:Any]]) ?? []

    if
        let next = (obj["links"] as? [String:Any])?["next"] as? String,
        next != url.absoluteString
    { url = URL(string: next)! } else { break }
}

// MARK: – Write ---------------------------------------------------------------

let json = try JSONSerialization.data(withJSONObject: reviews, options: [.prettyPrinted])
try json.write(to: URL(fileURLWithPath: outFile))
print("✅ Saved \(reviews.count) reviews → \(outFile)")
