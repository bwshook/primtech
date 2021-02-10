import { BufferGeometry } from "three";
import { Float32BufferAttribute } from "three";
import { makeNoise2D } from "open-simplex-noise";

export class FractalPlaneGeometry extends BufferGeometry {

    parameters: Object;

    constructor( width = 1, length = 1, widthSegments = 1, lengthSegments = 1, offsetX = 0, offsetZ = 0 ) {

        super();
        this.type = 'FractalPlaneGeometry';

        this.parameters = {
            width: width,
            length: length,
            widthSegments: widthSegments,
            lengthSegments: lengthSegments,
            offsetX: offsetX,
            offsetZ: offsetZ,
        };

        const width_half = width / 2;
        const length_half = length / 2;

        const gridX = Math.floor( widthSegments );
        const gridZ = Math.floor( lengthSegments );

        const gridX1 = gridX + 1;
        const gridZ1 = gridZ + 1;

        const segWidth = width / gridX;
        const segLength = length / gridZ;

        //

        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];

        const noise2D = makeNoise2D(100);
        const amplitude = 10.0;
        const frequencZ = 0.01;
        const octaves = 5;
        const persistence = 0.5;

        for ( let iZ = 0; iZ < gridZ1; iZ ++ ) {

            const z = iZ * segLength - length_half + offsetZ;

            for ( let ix = 0; ix < gridX1; ix ++ ) {

                const x = ix * segWidth - width_half + offsetX;

                let value = 0.0;
                for ( let octave = 0; octave < octaves; octave++ ) {
                    const freq = frequencZ * Math.pow(2, octave);
                    value += noise2D( x * freq, z * freq ) * ( amplitude * Math.pow( persistence, octave ) );
                }
                let normVal = value / ( 2 - 1 / Math.pow( 2, octaves - 1 ) );
                vertices.push( x, normVal, z );

                normals.push( 0, 0, 1 );

                uvs.push( ix / gridX );
                uvs.push( 1 - ( iZ / gridZ ) );

            }

        }

        for ( let iZ = 0; iZ < gridZ; iZ ++ ) {

            for ( let ix = 0; ix < gridX; ix ++ ) {

                const a = ix + gridX1 * iZ;
                const b = ix + gridX1 * ( iZ + 1 );
                const c = ( ix + 1 ) + gridX1 * ( iZ + 1 );
                const d = ( ix + 1 ) + gridX1 * iZ;

                indices.push( a, b, d );
                indices.push( b, c, d );

            }

        }

        this.setIndex( indices );
        this.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
        this.setAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
        this.setAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

        this.computeVertexNormals();
    }

}
