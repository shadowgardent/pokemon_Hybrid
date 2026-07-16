import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import PokemonCard from '@/components/PokemonCard';
import EmptyState from '@/components/EmptyState';
import { useFavorites } from '@/contexts/FavoritesContext';
import { POKEAPI_BASE_URL, getPokemonImageUrl, PokemonListItem } from '@/constants/Pokemon';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [favPokemon, setFavPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (favorites.length === 0) {
      setFavPokemon([]);
      return;
    }

    setLoading(true);
    try {
      const promises = favorites.map(async (id) => {
        try {
          const res = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`);
          const data = await res.json();
          return {
            id: data.id,
            name: data.name,
            url: '',
            types: data.types.map(
              (t: { type: { name: string } }) => t.type.name
            ),
            image: getPokemonImageUrl(data.id),
          } as PokemonListItem;
        } catch {
          return {
            id,
            name: `Pokemon #${id}`,
            url: '',
            types: [],
            image: getPokemonImageUrl(id),
          } as PokemonListItem;
        }
      });

      const results = await Promise.all(promises);
      setFavPokemon(results);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [favorites]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const renderItem = useCallback(
    ({ item }: { item: PokemonListItem }) => (
      <PokemonCard
        pokemon={item}
        onPress={() => router.push(`/pokemon/${item.id}`)}
      />
    ),
    [router]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFCB05" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="ยังไม่มีรายการโปรด"
          message="กดที่ไอคอนหัวใจเพื่อเพิ่มโปเกมอนที่ชื่นชอบ"
          icon="heart-dislike-outline"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favPokemon}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1929',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B1929',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
});
