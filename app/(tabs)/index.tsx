import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import PokemonSearchBar from '@/components/PokemonSearchBar';
import PokemonCard from '@/components/PokemonCard';
import EmptyState from '@/components/EmptyState';
import { POKEAPI_BASE_URL, getPokemonImageUrl, PokemonListItem } from '@/constants/Pokemon';

export default function PokemonListScreen() {
  const router = useRouter();
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPokemon = useCallback(async () => {
    try {
      const listRes = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=151`);
      const listData = await listRes.json();

      const basicList: PokemonListItem[] = listData.results.map(
        (p: { name: string; url: string }, index: number) => {
          const id = index + 1;
          return {
            id,
            name: p.name,
            url: p.url,
            image: getPokemonImageUrl(id),
            types: [],
          };
        }
      );

      const batchSize = 30;
      const allPokemon = [...basicList];

      for (let i = 0; i < allPokemon.length; i += batchSize) {
        const batch = allPokemon.slice(i, i + batchSize);
        const detailPromises = batch.map(async (p) => {
          try {
            const res = await fetch(`${POKEAPI_BASE_URL}/pokemon/${p.id}`);
            const data = await res.json();
            return {
              ...p,
              types: data.types.map(
                (t: { type: { name: string } }) => t.type.name
              ),
            };
          } catch {
            return p;
          }
        });

        const results = await Promise.all(detailPromises);
        results.forEach((result, idx) => {
          allPokemon[i + idx] = result;
        });
      }

      setPokemonList(allPokemon);
    } catch (error) {
      console.error('Failed to fetch Pokemon:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return pokemonList;
    const query = searchQuery.toLowerCase().trim();
    return pokemonList.filter((p) => p.name.toLowerCase().includes(query));
  }, [pokemonList, searchQuery]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPokemon();
  }, [fetchPokemon]);

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

  return (
    <View style={styles.container}>
      <PokemonSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {filteredList.length === 0 ? (
        <EmptyState
          title="ไม่พบโปเกมอน"
          message="ลองค้นหาด้วยชื่ออื่น"
          icon="search-outline"
        />
      ) : (
        <FlatList
          data={filteredList}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#FFCB05']}
              tintColor="#FFCB05"
            />
          }
        />
      )}
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
    paddingTop: 4,
    paddingBottom: 16,
  },
});
