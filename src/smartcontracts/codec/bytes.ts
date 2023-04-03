import { BytesValue } from "../typesystem/bytes";
import { SizeOfU32 } from "./constants";

/**
 * Encodes and decodes "BytesValue" objects.
 */
export class BytesBinaryCodec {
    decodeNested(buffer: Buffer): [BytesValue, number] {
        let length = buffer.readUInt32BE(0);
        let payload = buffer.slice(SizeOfU32, SizeOfU32 + length);
        let result = new BytesValue(payload);
        return [result, SizeOfU32 + length];
    }

    decodeTopLevel(buffer: Buffer): BytesValue {
        return new BytesValue(buffer);
    }

    encodeNested(bytes: BytesValue): Buffer {
        let lengthBuffer = Buffer.alloc(SizeOfU32);
        lengthBuffer.writeUInt32BE(bytes.getLength());
        let buffer = Buffer.concat([lengthBuffer, bytes.valueOf()]);
        return buffer;
    }

    encodeTopLevel(bytes: BytesValue): Buffer {
        return bytes.valueOf();
    }
}
